const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  const { cvText, jdText } = req.body;
  if (!cvText || !jdText) {
    return res.status(400).json({ error: 'cvText and jdText are required' });
  }

  const prompt = `You are a professional CV analyst. Analyse the following CV against the job description.

CV:
${cvText}

JOB DESCRIPTION:
${jdText}

Return a JSON object (no markdown, just raw JSON) with this exact structure:
{
  "matchScore": <number 0-100>,
  "strengths": [<array of strings — things the candidate clearly has>],
  "gaps": [
    {
      "id": <unique string id>,
      "skill": <string — name of the gap>,
      "question": <string — a yes/no question to ask the user about this gap, e.g. "Do you have experience with X?">,
      "detail": <string — follow-up prompt if they answer yes, e.g. "Briefly describe your experience">
    }
  ],
  "summary": <string — 2-3 sentence overall assessment>
}

Be concise. List at most 6 gaps. Focus on the most important skills mentioned in the job description that are missing or unclear from the CV.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();
    const analysis = JSON.parse(raw);
    res.json(analysis);
  } catch (err) {
    console.error('Analyse error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;
