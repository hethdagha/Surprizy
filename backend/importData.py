import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv  


load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")


try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"MongoDB Connection Error: {e}")
    exit()


try:
    df = pd.read_csv("surprizy.csv", on_bad_lines="skip")  
    print(f"CSV Loaded Successfully! Total Rows: {len(df)}")
except Exception as e:
    print(f"Error Loading CSV: {e}")
    exit()


df.dropna(inplace=True) 


data_dict = df.to_dict(orient="records")


try:
    if data_dict:
        collection.insert_many(data_dict)
        print("CSV data successfully inserted into MongoDB!")
    else:
        print("⚠ No valid data found to insert.")
except Exception as e:
    print(f"Error Inserting Data: {e}")