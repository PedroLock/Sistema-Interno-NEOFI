from pymongo import MongoClient
import os

# String de conexão do MongoDB Atlas
MONGODB_URI = 'mongodb+srv://pedrolock:PedroLock2004@cluster0.irjirro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

client = MongoClient(MONGODB_URI)
db = client['neofi']  # Nome do banco de dados 