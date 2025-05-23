FROM bitnami/spark:latest

COPY pipeline_spark_vehiculos.py /app/pipeline_spark_vehiculos.py
COPY mysql-connector-j-8.0.33.jar /jars/mysql-connector-j-8.0.33.jar

WORKDIR /app

CMD ["spark-submit", "--jars", "/jars/mysql-connector-j-8.0.33.jar", "/app/pipeline_spark_vehiculos.py"]
