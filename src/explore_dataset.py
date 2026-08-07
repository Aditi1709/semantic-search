import pandas as pd

# Read the Excel file
df = pd.read_excel("dataset/product_data.xlsx")

print("========== FIRST 5 ROWS ==========")
print(df.head())

print("\n========== COLUMN NAMES ==========")
print(df.columns.tolist())

print("\n========== DATASET INFORMATION ==========")
print(df.info())