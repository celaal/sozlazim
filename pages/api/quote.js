import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input || input.trim() === '') {
    return res.status(400).json({ error: 'Empty input' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Given a user's input (emotion or situation), respond with 10 culturally diverse proverbs or quotes from around the world.

For each item, include:
- Quote text
- Translation in the user's language
- Original language and country
- Author (if known, else null)
- Theme or emotion (e.g., love, betrayal)

Output format: JSON array with 10 objects. Each object must contain: text, translation, language, country, author, theme.`
        },
        {
          role: 'user',
          content: `The user wrote: "${input}"`
        }
      ],
      temperature: 0.7
    });

    const raw = chatCompletion.choices[0]?.message?.content;
    let quotes = [];

    try {
      quotes = JSON.parse(raw);
    } catch {
      quotes = [{ text: raw, translation: '', language: '', country: '', author: '', theme: '' }];
    }

    return res.status(200).json({ quotes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate quotes.' });
  }
}
