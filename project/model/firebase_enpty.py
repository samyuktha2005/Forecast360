import firebase_admin
from firebase_admin import credentials, firestore

# 🔥 Step 1: Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("model/service-account.json")  # Ensure the file exists!
    firebase_admin.initialize_app(cred)
    print("✅ Firebase connected successfully!")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    exit()

# 🔥 Step 2: Connect to Firestore
db = firestore.client()
collection_name = "weather_data"  # Firestore collection to delete

# 🔥 Step 3: Function to Delete All Documents
def delete_collection(collection_name):
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()
    
    deleted_count = 0
    for doc in docs:
        doc.reference.delete()
        deleted_count += 1
        print(f"🗑️ Deleted document {deleted_count}: {doc.id}")
    
    if deleted_count == 0:
        print(f"🚫 No documents found in '{collection_name}'.")
    else:
        print(f"✅ Successfully deleted {deleted_count} documents from '{collection_name}'.")

# 🔥 Step 4: Execute the Deletion
print(f"🗑️ Deleting all data from Firestore collection: {collection_name}...")
delete_collection(collection_name)
print("🎉 Data deletion complete!")
