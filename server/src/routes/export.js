const express = require('express');
const router = express.Router();
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

function textToDocx(text, title) {
  const lines = text.split('\n');
  const children = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ children: [new TextRun('')] }));
      continue;
    }

    // Simple heuristic: ALL CAPS short lines are headings
    if (trimmed === trimmed.toUpperCase() && trimmed.length < 60 && trimmed.length > 2) {
      children.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.replace(/^[•\-*]\s*/, ''), size: 22 })],
          bullet: { level: 0 },
          spacing: { after: 60 },
        })
      );
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })],
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return doc;
}

router.post('/', async (req, res) => {
  const { content, filename } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  try {
    const doc = textToDocx(content);
    const buffer = await Packer.toBuffer(doc);
    const safeFilename = (filename || 'document').replace(/[^a-z0-9_\-]/gi, '_') + '.docx';

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
