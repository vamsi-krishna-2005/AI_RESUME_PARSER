# Job & Networking Portal

A full-stack decentralized **Job & Networking Platform** inspired by **LinkedIn**, **AngelList**, and **Upwork**, with a twist of modern AI + Web3 integrations.

✅ Built with a clean modular structure and focuses on real-world scenarios such as:

* Blockchain-powered payments
* AI-driven resume parsing and job matching
* Admin dashboard and authentication

---

## 🌐 Live Deployment Plan

| Layer                              | Platform            |
| ---------------------------------- | ------------------- |
| Frontend (React + Tailwind)        | Vercel              |
| Backend (Node + Express + MongoDB) | Render              |
| Python Resume Parser + LLM API     | Localhost or Render |

---

## 🔍 Features Overview

### ✅ Module 1: Authentication & Admin Panel

* JWT-based login and registration
* Create and edit profile with:

  * Name, bio, LinkedIn, wallet address
  * Skills: manually added or AI-extracted from resume
* Admin-only login panel (auto-detected via hardcoded credentials)

  * Admin has elevated privileges for reviewing job posts, managing payments, etc.

### ✅ Module 2: Resume Upload & AI Skill Parser (LLM-enhanced)

* Upload a resume in `.pdf` format
* Uses **spaCy + keyword matcher + PyPDF2** to extract:

  * Relevant skills
  * Experience section
  * Education section
* Summary generated via **LLM** from extracted content
* AI model also suggests top 5 job titles that match user's profile
* Results returned to frontend as JSON and rendered dynamically

### ✅ Module 3: Blockchain Payment Integration

* Wallet connect using **MetaMask**
* Uses **Sepolia Ethereum Testnet** (funded via [Google Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))
* Admin and user use different wallets (Brave & Chrome)
* User pays platform fee before posting job
* Transaction is confirmed on-chain
* Job posting allowed only on success
* Transaction hash is logged in MongoDB (optional)

### ✅ Module 4: Job Posting & Feed

* Authenticated users can:

  * Post new jobs (title, description, required skills, tags)
  * View job feed
  * Filter jobs by skills/tags
* Admin can review all job postings

---

## 🧠 AI & LLM Components

* `resume_parser.py`: Python Flask microservice

  * Extracts text and sections from uploaded resumes
  * Uses spaCy and regex for section separation
* LLM prompt builder (internally called)

  * Summarizes candidate’s profile
  * Suggests **top matching job roles** using prompt chaining logic
* Results returned to frontend and rendered under "Resume Summary" section

---

## 📦 Installation & Run Commands

### 🔹 Backend (Node + Express)

```bash
cd backend
npm install
npx nodemon server.js
```

**Required Packages**:

```bash
npm install express cors dotenv mongoose jsonwebtoken multer pdf-parse axios bcryptjs
```

### 🔹 Frontend (React App)

```bash
cd app
npm install
npm run dev
```

**Used Packages**:

```bash
npm install axios ethers react-router-dom
```

### 🔹 Python AI Skill Parser

```bash
cd website
python resume_parser.py
```

**Python Requirements**:

```bash
pip install flask spacy PyPDF2
python -m spacy download en_core_web_sm
```

---

## 🔐 Blockchain Wallet Setup

* **Testnet**: Sepolia Ethereum
* **Wallets Used**:

  * Chrome (User wallet)
  * Brave (Admin wallet)
* **Tokens received from**: Google Web3 Faucet ([Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))
* User must:

  * Connect MetaMask
  * Pay 0.001 ETH (testnet) to admin wallet
  * Receive transaction hash back

---

## 📁 Folder Structure

```
website/
├── app/               # React Frontend
├── backend/           # Node + Express API
├── resume_parser.py   # Flask NLP Resume Parser
```

---


## ✅ Final Notes

* All components are modular and independently testable
* AI logic can be easily upgraded to use LLM APIs like OpenAI, Gemini, or Cohere
* Smart contract logging can be added if time permits
* Easy to extend into a production-grade platform with minimal code cleanup


