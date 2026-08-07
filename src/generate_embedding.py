import pandas as pd
from sentence_transformers import SentenceTransformer

# Step 1: Load the dataset
df = pd.read_excel("dataset/product_data.xlsx")

# Step 2: Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Step 3: Take the first product
product = df.iloc[0]

# Step 4: Combine useful information into one text
text = f"""
Category: {product['Category']}
Sub Category: {product['Sub-Category']}
Sub Sub Category: {product['Sub-sub-Category']}
Brand: {product['Brand']}
Product Name: {product['SKU Name']}
Description: {product['About the Product']}
"""

print("TEXT TO EMBED:")
print(text)

# Step 5: Generate the embedding
embedding = model.encode(text)

print("\nEmbedding generated successfully!")
print(f"Embedding dimensions: {len(embedding)}")
print(f"First 10 values: {embedding[:10]}")