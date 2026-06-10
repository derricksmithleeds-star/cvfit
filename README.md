# FitCV — AI-Powered CV Tailoring

A full-stack SaaS tool that tailors your CV and generates a cover letter for any job using AI.

## Setup

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure your API key

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

Get an API key at https://console.anthropic.com

### 3. Run the app

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

The app will open at **http://localhost:3000**

## Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Anthropic Claude (claude-sonnet-4-6)
- **File parsing**: pdf-parse (PDF), mammoth (DOCX)
- **Export**: docx npm package

## API Endpoints

| Method | Endpoint   | Description |
|--------|------------|-------------|
| POST   | /parse     | Parse uploaded PDF or DOCX, returns text |
| POST   | /analyse   | Analyse CV vs job description, returns match score + gaps |
| POST   | /tailor    | Rewrite CV and generate cover letter |
| POST   | /export    | Convert text to downloadable DOCX file |
