from flask import Flask, request, jsonify
import spacy
import PyPDF2
import re
from collections import defaultdict
import google.generativeai as genai
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, origins=['*'])

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Gemini API key
genai.configure(api_key="AIzaSyBvae2hYlfZRrfQz3buwHOR_VNSwDOqOus")

# Keywords to match from resume
SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "node.js", "c++", "c#", "html", "css",
    "sql", "mongodb", "aws", "docker", "kubernetes", "git", "linux", "flask", "django", "angular",
    "vue", "express", "tensorflow", "pytorch", "machine learning", "data analysis", "nlp", "rest api"
]

def extract_skills_from_text(text, skill_keywords):
    text_lower = text.lower()
    return list({skill for skill in skill_keywords if skill.lower() in text_lower})

def extract_experience(text):
    patterns = [r'(work experience|professional experience|experience)[\s\S]{0,1000}']
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            section = match.group(0)
            for stop in ['education', 'skills', 'projects', 'certifications']:
                idx = section.lower().find(stop)
                if idx > 0:
                    section = section[:idx]
            return section.strip()
    return None

def extract_sections(text):
    headers = ['education', 'experience', 'skills', 'projects', 'certifications']
    pattern = re.compile(r'(?P<header>' + '|'.join(headers) + r')\s*[:\n]', re.IGNORECASE)
    sections = defaultdict(str)
    last_header, last_pos = None, 0
    for match in pattern.finditer(text):
        header = match.group('header').lower()
        if last_header:
            sections[last_header] += text[last_pos:match.start()].strip()
        last_header, last_pos = header, match.end()
    if last_header:
        sections[last_header] += text[last_pos:].strip()
    return sections

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    print(f"✅ Resume received: {file.filename}")

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ''.join([page.extract_text() or '' for page in pdf_reader.pages])
    except Exception as e:
        return jsonify({"error": f"Failed to read PDF: {str(e)}"}), 400

    stop_keywords = ['education', 'experience', 'skills', 'projects', 'certifications', 'summary', 'objective', 'work history', 'employment', 'contact', 'profile']
    if not any(word in text.lower() for word in stop_keywords):
        return jsonify({"error": "The uploaded document does not appear to be a resume."}), 400

    doc = nlp(text)
    spacy_skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    keyword_skills = extract_skills_from_text(text, SKILL_KEYWORDS)
    experience = extract_experience(text)
    sections = extract_sections(text)

    return jsonify({
        "skills": list(set(spacy_skills + keyword_skills)),
        "summary": doc.text[:200],
        "experience": experience or "No experience found",
        "text": text,
        "education": sections.get('education', "Not found")
    })

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        experience = data.get('experience', '')
        education = data.get('education', '')

        # Gemini Summary Prompt
        summary_prompt = (
            f"Given the following candidate information:\n"
            f"Skills: {', '.join(skills)}\n"
            f"Experience: {experience}\n"
            f"Education: {education}\n"
            f"Write a professional summary for this candidate. Only return the summary text."
        )
        model = genai.GenerativeModel('gemini-2.0-flash')
        summary_response = model.generate_content(summary_prompt)
        summary = summary_response.text.strip()

        # Gemini Job Suggestions Prompt
        jobs_prompt = (
            f"Given the following candidate information:\n"
            f"Skills: {', '.join(skills)}\n"
            f"Experience: {experience}\n"
            f"Education: {education}\n"
            f"Suggest 5 job titles and descriptions in JSON array format with keys 'title' and 'description'."
        )
        jobs_response = model.generate_content(jobs_prompt)

        try:
            jobs_json = re.search(r'\[.*\]', jobs_response.text, re.DOTALL).group(0)
            job_suggestions = json.loads(jobs_json)
        except Exception:
            job_suggestions = []

        return jsonify({
            "summary": summary,
            "jobSuggestions": job_suggestions
        })
    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
