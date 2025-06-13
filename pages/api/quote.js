import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input || input.trim() === '') {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a multilingual quote expert. Provide at least 10 proverbs or meaningful quotes from different cultures that match the user's feeling. Each quote should include:

- Original text
- English translation
- Language and country of origin
- Author (if known)
- Theme/emotion`
        },
        {
          role: 'user',
          content: `User wrote: "${input}"`
        }
      ]
    });

    const result = completion.choices[0]?.message?.content || 'No result.';
    return res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return res.status(500).json({ error: 'Something went wrong while generating the quote.' });
  }
}
