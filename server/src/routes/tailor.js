const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  const { cvText, jdText, gapAnswers } = req.body;
  if (!cvText || !jdText) {
    return res.status(400).json({ error: 'cvText and jdText are required' });
  }

  const answersText = gapAnswers && gapAnswers.length > 0
    ? gapAnswers.map(a => `- ${a.skill}: ${a.hasExperience ? 'YES' : 'NO'}${a.detail ? ` — ${a.detail}` : ''}`).join('\n')
    : 'No gap answers provided.';

  const cvPrompt = `You are an expert CV writer. Rewrite the following CV to better match the job description, incorporating the candidate's answers about their experience.

ORIGINAL CV:
${cvText}

JOB DESCRIPTION:
${jdText}

CANDIDATE'S ANSWERS ABOUT EXPERIENCE GAPS:
${answersText}

Instructions:
- Rewrite the CV to highlight relevant experience and skills for this role
- Only include information that was in the original CV or confirmed in the gap answers
- Do NOT invent or fabricate any experience, qualifications, or achievements
- Use strong action verbs and quantify achievements where possible
- Format clearly with sections: Professional Summary, Experience, Skills, Education (and any other relevant sections from the original)
- Return only the CV text, no commentary`;

  const coverPrompt = `You are an expert cover letter writer. Write a compelling, personalised cover letter for this job application.

CV:
${cvText}

JOB DESCRIPTION:
${jdText}

CANDIDATE'S ADDITIONAL EXPERIENCE:
${answersText}

Instructions:
- Write a professional cover letter (3-4 paragraphs)
- Opening: strong hook that references the specific role and company
- Middle: connect the candidate's most relevant experience to key job requirements
- Only use information from the CV and gap answers — do NOT fabricate anything
- Closing: confident call to action
- Tone: professional but warm
- Do NOT include date, address headers, or "Dear Hiring Manager" — just the body paragraphs
- Return only the cover letter text, no commentary`;

  try {
    const [cvMessage, coverMessage] = await Promise.all([
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        messages: [{ role: 'user', content: cvPrompt }],
      }),
      client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: coverPrompt }],
      }),
    ]);

    res.json({
      tailoredCV: cvMessage.content[0].text.trim(),
      coverLetter: coverMessage.content[0].text.trim(),
    });
  } catch (err) {
    console.error('Tailor error:', err);
    res.status(500).json({ error: 'Tailoring failed' });
  }
});

module.exports = router;
