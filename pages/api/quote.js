// pages/api/quote.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Missing input' });
  }

  try {
    const prompt = `
You are a quote and proverb generator. Given the situation or emotion: "${input}", 
return a list of 10 quotes or proverbs from different cultures and languages.

Each item must include:
1. "text": original quote in its native language.
2. "translation": translation into the input's language (auto-detected).
3. "language": language and country of origin.
4. "author": person or "Anonymous".
5. "theme": the emotional or philosophical context.

Respond with a valid JSON array like:
[
  {
    "text": "...",
    "translation": "...",
    "language": "French (France)",
    "author": "...",
    "theme": "Trust"
  },
  ...
]`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a multilingual quote expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const output = response.data.choices[0].message.content.trim();
    const jsonStart = output.indexOf('[');
    const jsonEnd = output.lastIndexOf(']') + 1;
    const jsonString = output.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);

    return res.status(200).json({ quotes: parsed });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to generate quotes', detail: error.message });
  }
}
