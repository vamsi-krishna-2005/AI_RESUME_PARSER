from flask import Flask, request, jsonify
import spacy
import PyPDF2
import io
import re
from collections import defaultdict
import google.generativeai as genai
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This will allow all origins by default
nlp = spacy.load("en_core_web_sm")

# Set your Gemini API key
genai.configure(api_key="AIzaSyBvae2hYlfZRrfQz3buwHOR_VNSwDOqOus")

SKILL_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "node.js", "c++", "c#", "html", "css",
    "sql", "mongodb", "aws", "docker", "kubernetes", "git", "linux", "flask", "django", "angular",
    "vue", "express", "tensorflow", "pytorch", "machine learning", "data analysis", "nlp", "rest api"
    # ...add more as needed
]

def extract_skills_from_text(text, skill_keywords):
    text_lower = text.lower()
    found_skills = set()
    for skill in skill_keywords:
        if skill.lower() in text_lower:
            found_skills.add(skill)
    return list(found_skills)

def extract_experience(text):
    # Look for sections like "Experience", "Work Experience", etc.
    experience_patterns = [
        r'(work experience|professional experience|experience)[\s\S]{0,1000}',  # up to 1000 chars after header
    ]
    for pattern in experience_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            # Get the matched section, stop at next section header if possible
            section = match.group(0)
            # Optionally, stop at the next all-caps line or "Education", etc.
            stop_keywords = ['education', 'skills', 'projects', 'certifications']
            for stop in stop_keywords:
                idx = section.lower().find(stop)
                if idx > 0:
                    section = section[:idx]
            # Clean up and return
            return section.strip()
    return None

def extract_sections(text):
    # Define section headers you want to extract
    section_headers = ['education', 'experience', 'skills', 'projects', 'certifications']
    section_pattern = re.compile(r'(?P<header>' + '|'.join(section_headers) + r')\s*[:\n]', re.IGNORECASE)
    sections = defaultdict(str)
    last_header = None
    last_pos = 0

    for match in section_pattern.finditer(text):
        header = match.group('header').lower()
        if last_header is not None:
            sections[last_header] += text[last_pos:match.start()].strip()
        last_header = header
        last_pos = match.end()
    if last_header is not None:
        sections[last_header] += text[last_pos:].strip()
    return sections

def generate_summary_with_gemini(skills, experience, education):
    prompt = f"""
    Given the following candidate information:
    Skills: {', '.join(skills)}
    Experience: {experience}
    Education: {education}
    Write a professional summary for this candidate. Only return the summary text.
    """
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    content = response.text
    try:
        result = json.loads(content)
    except Exception:
        # fallback: just return the text as summary
        result = {"summary": content, "jobSuggestions": []}
    return result

@app.route('/parse', methods=['POST'])
def parse_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['resume']
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""

    # Check for resume stop words/sections
    stop_words = [
        'education', 'experience', 'skills', 'projects', 'certifications',
        'summary', 'objective', 'work history', 'employment', 'contact', 'profile'
    ]
    found_sections = [word for word in stop_words if word in text.lower()]
    print(found_sections)
    if not found_sections:
        return jsonify({"error": "The uploaded document does not appear to be a resume. Please upload a valid resume containing sections like Education, Experience, Skills, etc."}), 400

    doc = nlp(text)
    spacy_skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    keyword_skills = extract_skills_from_text(text, SKILL_KEYWORDS)
    experience = extract_experience(text)
    sections = extract_sections(text)
    return jsonify({
        "skills": list(set(spacy_skills + keyword_skills)),
        "summary": doc.text[:200],
        "experience": experience if experience else "No experience",
        "text": text,
        "education": sections['education']
    })

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        experience = data.get('experience', '')
        education = data.get('education', '')

        # Prompt for summary only
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

        # Prompt for job suggestions only
        jobs_prompt = (
            f"Given the following candidate information:\n"
            f"Skills: {', '.join(skills)}\n"
            f"Experience: {experience}\n"
            f"Education: {education}\n"
            f"Suggest 5 job titles and descriptions of that role not complete description as a JSON array with keys 'title' and 'description'."
        )
        jobs_response = model.generate_content(jobs_prompt)
        # Try to extract JSON from the response
        try:
            jobs_json = re.search(r'\[.*\]', jobs_response.text, re.DOTALL).group(0)
            job_suggestions = json.loads(jobs_json)
            # print("Job Suggestions:", job_suggestions)  # Print job suggestions for debugging
        except Exception:
            job_suggestions = []

        return jsonify({
            "summary": summary,
            "jobSuggestions": job_suggestions
        })
    except Exception as e:
        print("Gemini error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0' ,debug = True, port=5001)
