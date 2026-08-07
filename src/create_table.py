import psycopg

conn = psycopg.connect(
    host="localhost",
    dbname="semantic_search",
    user="aditiagarwal"
)

cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category TEXT,
    sub_category TEXT,
    sub_sub_category TEXT,
    brand TEXT,
    sku_name TEXT,
    about_product TEXT,
    embedding VECTOR(384)
);
""")

conn.commit()

print("✅ Products table created successfully!")

cur.close()
conn.close()