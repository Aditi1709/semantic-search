import pandas as pd
import psycopg
from sentence_transformers import SentenceTransformer

df = pd.read_excel("dataset/product_data.xlsx")
model = SentenceTransformer("all-MiniLM-L6-v2")

df["combined_text"] = (
    "Category: " + df["Category"] +
    "\nSub Category: " + df["Sub-Category"] +
    "\nSub Sub Category: " + df["Sub-sub-Category"] +
    "\nBrand: " + df["Brand"] +
    "\nProduct Name: " + df["SKU Name"] +
    "\nDescription: " + df["About the Product"]
)

embeddings = model.encode(
    df["combined_text"].tolist(),
    show_progress_bar=True
)

df["embedding"] = embeddings.tolist()

conn = psycopg.connect(
    host="localhost",
    port=5433,
    dbname="semantic_search",
    user="aditiagarwal",
    password="semantic_password"
)

print("Connected to PostgreSQL")

cur = conn.cursor()

insert_query = """
INSERT INTO products (
    category,
    sub_category,
    sub_sub_category,
    brand,
    sku_name,
    about_product,
    embedding
)
VALUES (%s, %s, %s, %s, %s, %s, %s);
"""
for _, row in df.iterrows():
        cur.execute(
        insert_query,
        (
            row["Category"],
            row["Sub-Category"],
            row["Sub-sub-Category"],
            row["Brand"],
            row["SKU Name"],
            row["About the Product"],
            row["embedding"]
        )
    )
        
conn.commit()

cur.execute("SELECT COUNT(*) FROM products;")
count = cur.fetchone()[0]

print(f"✅ Products currently in database: {count}")

cur.close()
conn.close()