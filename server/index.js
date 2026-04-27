import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// The server handles the API and, in production, also serves the built React app.
const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Main review endpoint: it validates input, calls Hugging Face, and returns the AI review.
app.post('/api/review', async (req, res) => {
  try {
    const { code, language, uiLang } = req.body ?? {};

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured.' });
    }

    // UI language controls the language of the final explanation returned by the model.
    const responseLanguage = uiLang === 'tn'
      ? 'Tunisian Derja'
      : uiLang === 'fr'
        ? 'French'
        : 'English';

    // This prompt tells the model how to behave and which markdown sections to use.
    const prompt = [
      'You are a Principal Engineer at a top-tier tech company such as Google or Meta.',
      'Be strict, critical, and precise.',
      `This is a ${language || 'unknown'} code.`,
      `Respond in ${responseLanguage}.`,
      'Review the code below with a production mindset.',
      'Find bugs, security issues, performance problems, and design flaws.',
      'Suggest concrete improvements, refactoring opportunities, and safer patterns.',
      'Return Markdown only and use exactly these sections in this order:',
      '## Bugs',
      '## Security',
      '## Performance',
      '## Improvements',
      '## Suggested Fix',
      'Every section must contain concise bullet points.',
      'If a section has no findings, write one bullet that says "None found."',
      'Prefer specific, actionable feedback over generic advice.',
      'Call out risks clearly and do not be overly lenient.',
      '',
      'Code:',
      '```',
      code,
      '```'
    ].join('\n');

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-Coder-7B-Instruct:fastest',
        messages: [
          {
            role: 'system',
            content: 'You are a Principal Engineer and expert code reviewer. Be strict, precise, and production-focused.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 700,
        temperature: 0.2,
        stream: false
      })
    });

    const responseText = await response.text();
    const data = parseMaybeJson(responseText);

    if (!response.ok) {
      const message = data?.error || data?.message || responseText.trim() || 'Hugging Face request failed.';
      return res.status(response.status).json({ error: message });
    }

    const reviewText = data?.choices?.[0]?.message?.content
      ?? (Array.isArray(data)
        ? data[0]?.generated_text ?? data[0]?.summary_text ?? ''
        : data?.generated_text ?? data?.summary_text ?? data?.error ?? '');

    if (!reviewText) {
      return res.status(502).json({ error: 'No review text was returned by the model.' });
    }

    return res.json({ review: reviewText.trim() });
  } catch (error) {
    console.error('Review request failed:', error);
    return res.status(500).json({ error: 'Unable to generate review.' });
  }
});

if (process.env.NODE_ENV === 'production' && fsExists(clientDistPath)) {
  // In production, Express serves the React build so Render can run one service only.
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// The server listens on Render's port, or 5000 locally if no port is provided.
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function fsExists(targetPath) {
  // Small helper so production static serving only runs when the build folder exists.
  return fs.existsSync(targetPath);
}

function parseMaybeJson(value) {
  // Hugging Face sometimes returns plain text errors, so we safely try JSON first.
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
