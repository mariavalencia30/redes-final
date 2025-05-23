import bcrypt

# Contraseña que deseas establecer
password = "ganeredes2518"

# Generación del hash bcrypt
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Imprimir el hash generado
print(hashed)
