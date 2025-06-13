import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a multilingual quote expert. Provide quotes or proverbs from any culture that match the user's emotion.`,
        },
        {
          role: 'user',
          content: `User's input: "${input}"\n\nReturn at least 10 proverbs or famous quotes from different cultures, with:\n- The original quote\n- Language and country\n- English translation\n- Author if known\n- Associated theme`,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content || 'No quote found';
    res.status(200).json({ result });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
}