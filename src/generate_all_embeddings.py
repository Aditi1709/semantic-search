import pandas as pd
from sentence_transformers import SentenceTransformer

# Step 1: Load the dataset
df = pd.read_excel("dataset/product_data.xlsx")

# Step 2: Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Step 3: Create a combined text column for every product
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

print(df[["SKU Name", "embedding"]].head())

print("\nTotal Products:", len(df))

print("Embedding Dimension:", len(df["embedding"][0]))