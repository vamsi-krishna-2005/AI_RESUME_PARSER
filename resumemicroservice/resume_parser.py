from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['resume']
    print("✅ Received resume:", file.filename)

    # Dummy logic for now — replace with your own parser logic
    result = {
        "name": "John Doe",
        "skills": ["Python", "Flask", "ML"],
        "filename": file.filename
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
