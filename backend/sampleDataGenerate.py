import pandas as pd
import random

# Define base data arrays
genders = ["Male", "Female"]
relationships_male = [
    "Friend", "Husband", "Father", "Brother", "Son", "Boss", "Colleague",
    "Grandfather", "Uncle", "Boyfriend", "Fiancé", "Teacher", "Mentor",
    "Teammate", "Neighbor", "Cousin"
]
relationships_female = [
    "Friend", "Wife", "Mother", "Sister", "Daughter", "Boss", "Colleague",
    "Grandmother", "Aunt", "Girlfriend", "Fiancée", "Teacher", "Mentor",
    "Teammate", "Neighbor", "Cousin"
]
occasions_male = [
    "Anniversary", "Baby & Expecting", "Birthday", "Christmas", "Diwali",
    "Father's Day", "Friendship Day", "New Year's", "Raksha Bandhan", "Graduation",
    "Promotion", "Retirement", "Men's Day", "Housewarming", "Farewell",
    "Valentine's Day", "Achievement Celebration", "Sports Victory"
]
occasions_female = [
    "Anniversary", "Baby & Expecting", "Birthday", "Christmas", "Diwali",
    "Friendship Day", "Mother's Day", "New Year's", "Raksha Bandhan", "Graduation",
    "Promotion", "Retirement", "Women's Day", "Karva Chauth", "Housewarming",
    "Farewell", "Valentine's Day", "Bridal Shower", "Achievement Celebration"
]
budgets = [200, 500, 1000, 2000, 5000, 10000, 50000]
interests = [
    "Art", "Writing", "Reading", "Fashion", "Travel", "Sports", "Health", "Music",
    "Technology", "Movies", "Food", "Gaming", "Fitness", "Photography", "DIY",
    "Gardening", "Cooking", "Nature", "Animals", "Spirituality", "Finance",
    "Education", "History", "Science", "Cars", "Comedy", "Adventure", "Dance",
    "Volunteering", "Languages", "Anime", "Crafts", "Makeup", "Parenting",
    "Home Decor", "Astronomy", "Investing", "Politics", "Environment", "Podcasts",
    "Theater", "Board Games", "Magic", "Blogging", "Vlogging", "Coding",
    "Public Speaking", "Meditation"
]
gift_names = [
    "Smartwatch", "Elegant Pendant", "PS5 Controller", "Spa Kit", "Luxury Travel Kit",
    "Personalized Mug", "Gaming Mouse", "Handmade Bracelet", "Desk Organizer",
    "Leather Wallet", "Cookware Set", "Bookshelf", "Bluetooth Speaker", "Yoga Mat",
    "Camera Lens", "Backpack", "Art Supplies", "Board Game", "Coffee Maker",
    "Perfume Set", "Laptop Stand", "Jewelry Box", "Scented Candles", "Hiking Gear",
    "LED Lamp", "Wireless Charger", "Photo Frame", "Subscription Box", "Mini Projector",
    "Customized T-shirt", "Painting Kit", "Indoor Plant", "Fitness Band", "Massage Gun"
]
descriptions = [
    "High quality", "Premium design", "Eco-friendly materials", "Handmade with love",
    "Personalized for a special touch", "Tech-savvy and modern", "Comfortable and useful",
    "A perfect gift for any occasion", "Trendy and stylish", "Compact and practical"
]

# Generate dataset
def generate_gift_data(num_samples=100):
    data = []
    for _ in range(num_samples):
        gender = random.choice(genders)
        relationship = random.choice(relationships_male if gender == "Male" else relationships_female)
        occasion = random.choice(occasions_male if gender == "Male" else occasions_female)
        age = random.randint(18, 60)
        budget = random.choice(budgets)
        interest_sample = random.sample(interests, random.randint(2, 4))
        interest_str = ",".join(interest_sample)
        gift = random.choice(gift_names)
        description = f"{random.choice(descriptions)} {gift.lower()}"
        link = f"https://example.com/{gift.replace(' ', '').lower()}"
        rating = random.randint(3, 5)

        data.append([age, gender, relationship, occasion, budget, interest_str, gift, description, link, rating])
    return data

# Generate 100 gift records
gift_data = generate_gift_data(100)

# Define column names
columns = ["age", "gender", "relationship", "occasion", "budget", "interests", "gift_name", "description", "link", "rating"]

# Create DataFrame and save to CSV
df = pd.DataFrame(gift_data, columns=columns)
csv_path = "./gift_dataset.csv"
df.to_csv(csv_path, index=False)

csv_path
    