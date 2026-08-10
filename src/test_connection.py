import psycopg

conn = psycopg.connect(
    host="localhost",
    port=5433,
    dbname="semantic_search",
    user="aditiagarwal",
    password="semantic_password"
)

print("✅ Connected to Docker PostgreSQL!")

conn.close()