import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/review', async (req, res) => {
  try {
    const { code, language } = req.body ?? {};

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured.' });
    }

    const responseLanguage = uiLang === 'tn'
      ? 'Tunisian Derja'
      : uiLang === 'fr'
        ? 'French'
        : 'English';

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
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function fsExists(targetPath) {
  return fs.existsSync(targetPath);
}

function parseMaybeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
