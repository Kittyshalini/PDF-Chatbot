from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import pdfvectorizer
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return "Hello, Shalini!"

@app.route('/read', methods=['POST'])
def readingFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    data = request.files['file']
    document = pdfvectorizer.vectorize(data)
    return jsonify({"status": document})

@app.route('/chat', methods=['POST'])
def chat():
    json_data = request.get_json()
    query = json_data.get('query', '')

    if not query:
        return jsonify({"error": "Query is required"}), 400

    response = pdfvectorizer.chatBot(query)
    return jsonify({"response": response})


if __name__ == '__main__':
        app.run(debug=True)