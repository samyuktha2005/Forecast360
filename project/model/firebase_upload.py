import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import time  # Add delay to prevent rate limiting

# 🔥 Step 1: Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("model/service-account.json")  # Ensure this file exists!
    firebase_admin.initialize_app(cred)
    print("✅ Firebase connected successfully!")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    exit()

# 🔥 Step 2: Connect to Firestore
db = firestore.client()
collection_name = "weather_data"  # Firestore collection name

# 🔥 Step 3: Load CSV File
#csv_file_path = "model/standardized_weather_data.csv"  # Ensure correct file path
csv_file_path = "model/jena_climate_2009_2016.csv"  # Ensure correct file path
try:
    df = pd.read_csv(csv_file_path)
    print(f"✅ CSV file '{csv_file_path}' loaded successfully!")
    print("Columns in CSV:", df.columns.tolist())  # Debugging - Check column names
except FileNotFoundError:
    print(f"❌ CSV file '{csv_file_path}' not found!")
    exit()

# 🔥 Step 4: Strip Whitespaces from Column Names
df.columns = df.columns.str.strip()  # Remove spaces in column names

# 🔥 Step 5: Verify & Rename Date Column
# Ensure DateTime is correctly formatted
if "Date Time (ISO 8601)" in df.columns:
    df = df.rename(columns={"Date Time (ISO 8601)": "date_time"})

# 🔥 Step 6: Remove NaN Values (Firestore Doesn't Accept NaN)
df = df.dropna()

# 🔥 Step 7: Upload Data to Firestore
print(f"📤 Uploading data to Firestore collection: {collection_name}...")

for index, row in df.iterrows():
    try:
        # Convert row to dictionary dynamically
        data = row.to_dict()
        db.collection(collection_name).add(data)
        print(f"✅ Uploaded row {index + 1}")
        time.sleep(0.1)  # Delay to prevent Firestore rate limits
    except Exception as e:
        print(f"❌ Error uploading row {index + 1}: {e}")

print("🎉 Data upload complete!")
