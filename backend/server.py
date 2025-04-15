from flask import Flask, jsonify, request, make_response
from flask_restful import Api
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer
import matplotlib
import bcrypt
import jwt
from datetime import datetime, timedelta
import warnings
import os
import random
import joblib

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Suppress unnecessary warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)

# Set environment variables
matplotlib.use('SVG')
os.environ["JOBLIB_START_METHOD"] = "spawn"

# Flask app initialization
app = Flask(__name__)
api = Api(app)

# Load environment variables
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
CORS(app, supports_credentials=True, origins=[os.getenv('FRONTEND_URL')])

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client.flask_db
todos = db.Database
users = db.users

# User registration route
@app.route('/user/register', methods=['POST'])
def register_user():
    content = request.json
    email = content.get('email')
    password = content.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store the user data
    users.insert_one({
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201

# User login route
# User login route
@app.route('/user/login', methods=['POST'])
def user_login():
    content = request.json
    email = content.get('email')
    password = content.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = users.find_one({"email": email})
    if user:
        stored_password = user['password']

        # Debug log to ensure correct password encoding and comparison
        print("Received password:", password)
        print("Stored password:", stored_password)
        print("Type of stored password:", type(stored_password))

        # Ensure stored password is in bytes format
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')

        # Compare the plaintext password with the hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(days=1)
            }, app.config['SECRET_KEY'], algorithm='HS256')

            response = jsonify({"message": "Login successful", "token": token})
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response
        else:
            print("Password mismatch: Provided password does not match stored hash.")
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        print("No user found with the provided email.")
        return jsonify({"message": "Invalid credentials"}), 401



# Helper function to filter and recommend gifts
def filter_recommendations(dataset, age, gender, interests, relationship, occasion, budget):
    # Encode categorical data
    gender_map = {val: i for i, val in enumerate(dataset['gender'].unique())}
    interests_map = {val: i for i, val in enumerate(dataset['interests'].unique())}
    dataset['gender'] = dataset['gender'].map(gender_map)
    dataset['interests'] = dataset['interests'].map(interests_map)

    # Handle missing data for unseen categories
    gender = gender_map.get(gender, 0)  # Default to 0 if gender is not recognized
    interests = interests_map.get(interests, 0)  # Default to 0 if interests are not recognized

    # Create dataframe for the new customer
    df = dataset[['age', 'gender', 'interests']]
    new_customer = pd.DataFrame([{
        'age': age,
        'gender': gender,
        'interests': interests
    }])

    # KMeans clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(df)
    new_cluster = kmeans.predict(new_customer)[0]
    dataset['Cluster'] = clusters
    cluster_data = dataset[dataset['Cluster'] == new_cluster]

    # Filter by budget and rating
    recommendations = cluster_data[(cluster_data['budget'] <= budget) & (cluster_data['rating'] >= 2.5)]

    # Shuffle and filter recommendations based on additional fields
    filters = [
        ('interests', lambda df: df[df['interests'] == interests]),
        ('occasion', lambda df: df[df['occasion'] == occasion]),
        ('relationship', lambda df: df[df['relationship'] == relationship]),
    ]
    
    random.shuffle(filters)

    for label, filter_fn in filters:
        filtered = filter_fn(recommendations)
        if len(filtered) >= 5:
            recommendations = filtered
        if len(recommendations) <= 5:
            break

    recommendations = recommendations.sample(frac=1, random_state=None).sort_values(by='rating', ascending=False)
    final_data = []

    seen = set()
    for _, row in recommendations.iterrows():
        if len(final_data) >= 8:
            break
        if row['gift_name'] not in seen:
            final_data.append({
                "Gift": row['gift_name'],
                "Rating": row['rating'],
                "Link": row['link'],
                "ImageLink": row.get('image_link', ''),
                "Description": row.get('description', 'No description available.')
            })
            seen.add(row['gift_name'])

    # If no data found, fallback to top-rated in the cluster
    if not final_data:
        top_items = cluster_data.sort_values(by='rating', ascending=False).head(8)
        final_data = [({
            "Gift": row['gift_name'],
            "Rating": row['rating'],
            "Link": row['link'],
            "ImageLink": row.get('image_link', ''),
            "Description": row.get('description', 'No description available.')
        }) for _, row in top_items.iterrows()]

    return final_data

# Gift recommendation route
@app.route('/getGift', methods=['POST', 'OPTIONS'])
def get_gift():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", os.getenv('FRONTEND_URL'))
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    try:
        content = request.get_json()
        print("Received request data:", content)

        if not content:
            return jsonify({"error": "Empty or invalid JSON in request body."}), 400

        required_fields = ['age', 'gender', 'interests', 'relationship', 'occasion', 'budget']
        for field in required_fields:
            if field not in content:
                print(f"Missing field: {field}")
                return jsonify({"error": f"Missing field: {field}"}), 400

        age = int(content['age'])
        gender = content['gender']
        interests = content['interests']
        relationship = content['relationship']
        occasion = content['occasion']
        budget_str = content['budget']

        try:
            budget = int(str(budget_str).replace(",", "").strip())
        except ValueError:
            print("Budget format error:", budget_str)
            return jsonify({"error": "Invalid budget format."}), 400

        # Load data
        records = list(todos.find({}, {"_id": 0}))
        if len(records) < 3:
            print("Insufficient data in DB")
            return jsonify({"error": "Not enough data to generate recommendations."}), 400

        dataset = pd.DataFrame(records)
        print("Dataset loaded. Columns:", dataset.columns.tolist())

        required_cols = ['age', 'gender', 'interests', 'gift_name', 'rating', 'relationship', 'occasion', 'budget', 'link', 'description']
        for col in required_cols:
            if col not in dataset.columns:
                print("Missing column in dataset:", col)
                return jsonify({"error": f"Missing column in dataset: {col}"}), 500

        # Call the recommendation function
        final_recommendations = filter_recommendations(dataset, age, gender, interests, relationship, occasion, budget)

        # Return recommendations as response
        response = make_response(jsonify(final_recommendations))
        response.headers.add("Access-Control-Allow-Origin", os.getenv('FRONTEND_URL'))
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    except Exception as e:
        print("Unhandled error in /getGift:", str(e))
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use PORT from env or fallback to 5000
    app.run(host="0.0.0.0", port=port, debug=True)

