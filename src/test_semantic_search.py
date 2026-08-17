import psycopg
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

search_text = "strong coffee for mornings"

query_embedding = model.encode(search_text).tolist()

conn = psycopg.connect(
    host="localhost",
    port=5433,
    dbname="semantic_search",
    user="aditiagarwal",
    password="semantic_password"
)

cur = conn.cursor()

query = """
SELECT
    id,
    sku_name,
    embedding <=> %s::vector AS distance
FROM products
ORDER BY embedding <=> %s::vector
LIMIT 5;
"""

cur.execute(
    query,
    (query_embedding, query_embedding)
)

results = cur.fetchall()

for row in results:
    print(row)

cur.close()
conn.close()