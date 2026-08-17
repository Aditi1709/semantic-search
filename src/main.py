from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Semantic Search API")

# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_db_connection():
    return psycopg.connect(
        host="localhost",
        port=5433,
        dbname="semantic_search",
        user="aditiagarwal",
        password="semantic_password"
    )


@app.get("/")
def home():
    return {
        "message": "Semantic Search API is running"
    }


@app.get("/api/recommendations")
def recommendations(product_id: int, limit: int = 5):

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
    SELECT
        id,
        sku_name,
        brand,
        category,
        embedding <=> (
            SELECT embedding
            FROM products
            WHERE id = %s
        ) AS distance
    FROM products
    WHERE id != %s
    ORDER BY embedding <=> (
        SELECT embedding
        FROM products
        WHERE id = %s
    )
    LIMIT %s;
    """

    cur.execute(
        query,
        (product_id, product_id, product_id, limit)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    results = []

    for row in rows:
        results.append({
            "id": row[0],
            "sku_name": row[1],
            "brand": row[2],
            "category": row[3],
            "distance": float(row[4])
        })

    return {
        "product_id": product_id,
        "results": results
    }


@app.get("/api/semantic-search")
def semantic_search(q: str, limit: int = 5):

    # Convert the search query into an embedding
    query_embedding = model.encode(q).tolist()

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
    SELECT
        id,
        sku_name,
        brand,
        category,
        embedding <=> %s::vector AS distance
    FROM products
    ORDER BY embedding <=> %s::vector
    LIMIT %s;
    """

    cur.execute(
        query,
        (query_embedding, query_embedding, limit)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    results = []

    for row in rows:
        results.append({
            "id": row[0],
            "sku_name": row[1],
            "brand": row[2],
            "category": row[3],
            "distance": float(row[4])
        })

    return {
        "query": q,
        "results": results
    }