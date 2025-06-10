from pymongo import MongoClient
import os

# String de conexão do MongoDB Atlas
MONGODB_URI = os.environ.get('MONGODB_URI')

client = MongoClient(MONGODB_URI)
db = client['neofi']  # Nome do banco de dados 