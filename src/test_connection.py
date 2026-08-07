import psycopg

conn = psycopg.connect(
    host="localhost",
    dbname="semantic_search",
    user="aditiagarwal"
)

print("✅ Connected successfully!")
conn.close()