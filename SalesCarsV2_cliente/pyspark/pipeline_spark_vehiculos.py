from pyspark.sql import SparkSession
from pyspark.sql.functions import col, upper, round, avg, count

# 1. Crear sesión Spark con conector MySQL
spark = SparkSession.builder \
    .appName("PipelineVehiculosUsados") \
    .master("spark://spark-master:7077") \
    .config("spark.driver.extraClassPath", "/jars/mysql-connector-java-8.0.33.jar") \
    .getOrCreate()
print(spark.sparkContext.master)


# 2. Cargar dataset CSV (ajusta la ruta)
df = spark.read.csv("/app/data/uae_used_cars_10k.csv", header=True, inferSchema=True)

# 3. Limpieza básica
df_clean = df.dropna(subset=["make", "model", "price", "year", "mileage"])

# 4. Transformaciones
df_transformed = df_clean \
    .withColumn("make_upper", upper(col("make"))) \
    .withColumn("price_usd", col("price") * 1.0) \
    .withColumn("car_age", 2025 - col("year"))

# 5. Crear vista temporal SQL
df_transformed.createOrReplaceTempView("vehiculos")

# 6. Definir funciones para guardar en DB
def save_to_db(df, table_name):
    df.write.format("jdbc")\
        .option("url", "jdbc:mysql://salescarsv2_db:3306/vehiculosbd")\
        .option("dbtable", table_name)\
        .option("user", "root")\
        .option("password", "password")\
        .option("driver", "com.mysql.cj.jdbc.Driver")\
        .mode("overwrite")\
        .save()

# 7. Consultas y guardado

# Consulta 1 - Promedio precio por marca
avg_price_by_make = spark.sql("""
    SELECT make, ROUND(AVG(price_usd), 2) AS avg_price, COUNT(*) AS total_vehicles
    FROM vehiculos
    GROUP BY make
    ORDER BY avg_price DESC
""")
save_to_db(avg_price_by_make, "avg_price_by_make")

# Consulta 2- Conteo vehículos por año
count_by_year = spark.sql("""
    SELECT year, COUNT(*) AS total_vehicles
    FROM vehiculos
    GROUP BY year
    ORDER BY year DESC
""")
save_to_db(count_by_year, "count_by_year")

# Consulta 3-Distribución por rango de precio
spark.sql("""
    CREATE OR REPLACE TEMP VIEW vehiculos_price_ranges AS
    SELECT *,
      CASE
        WHEN price_usd < 10000 THEN 'Bajo'
        WHEN price_usd BETWEEN 10000 AND 30000 THEN 'Medio'
        ELSE 'Alto'
      END AS price_range
    FROM vehiculos
""")
count_by_price_range = spark.sql("""
    SELECT price_range, COUNT(*) AS total
    FROM vehiculos_price_ranges
    GROUP BY price_range
    ORDER BY price_range
""")
save_to_db(count_by_price_range, "count_by_price_range")

# Consulta 4 - Modelos populares por marca
top_models_by_make = spark.sql("""
    SELECT make, model, COUNT(*) AS count_models
    FROM vehiculos
    GROUP BY make, model
    ORDER BY make, count_models DESC
""")
save_to_db(top_models_by_make, "top_models_by_make")

# Consulta 5 - Vehículos con menor kilometraje
lowest_mileage_vehicles = spark.sql("""
    SELECT make, model, mileage
    FROM vehiculos
    WHERE mileage IS NOT NULL
    ORDER BY mileage ASC
    LIMIT 5
""")
save_to_db(lowest_mileage_vehicles, "lowest_mileage_vehicles")

# Consulta 6 - Promedio precio por tipo de transmisión
avg_price_by_transmission = spark.sql("""
    SELECT transmission, ROUND(AVG(price_usd), 2) AS avg_price, COUNT(*) AS total
    FROM vehiculos
    GROUP BY transmission
    ORDER BY avg_price DESC
""")
save_to_db(avg_price_by_transmission, "avg_price_by_transmission")

# Consulta 7 - Conteo por tipo de combustible
count_by_fuel_type = spark.sql("""
    SELECT `Fuel Type`, COUNT(1) AS total
    FROM vehiculos
    GROUP BY `Fuel Type`
    ORDER BY total DESC
""")
save_to_db(count_by_fuel_type, "count_by_fuel_type")

# Consulta 8 - Distribución por color
count_by_color = spark.sql("""
    SELECT Color, COUNT(*) AS total
    FROM vehiculos
    GROUP BY Color
    ORDER BY total DESC
    LIMIT 10
""")
save_to_db(count_by_color, "count_by_color")

# Consulta 9 - Edad promedio vehículos por marca
avg_car_age_by_make = spark.sql("""
    SELECT `Make`, ROUND(AVG(2025 - `Year`), 2) AS avg_car_age
    FROM vehiculos
    GROUP BY `Make`
    ORDER BY avg_car_age DESC
""")
save_to_db(avg_car_age_by_make, "avg_car_age_by_make")

# Consulta 10 - Precio promedio por cilindrada
avg_price_by_engine = spark.sql("""
    SELECT
      `Cylinders` AS engine_range,
      ROUND(AVG(Price), 2) AS avg_price,
      COUNT(*) AS total
    FROM vehiculos
    GROUP BY `Cylinders`
    ORDER BY engine_range
""")
save_to_db(avg_price_by_engine, "avg_price_by_engine")


# Consulta 11 - vehículos con precio > 50,000 y menos de 100,000 de kilometraje
vehiculos_procesados = spark.sql("""
    SELECT make, model, year, price_usd, mileage
    FROM vehiculos
    WHERE price_usd > 50000 AND mileage < 100000
    ORDER BY price_usd DESC
""")
save_to_db(vehiculos_procesados, "vehiculos_procesados")


# 8. Finalizar Spark
spark.stop()
