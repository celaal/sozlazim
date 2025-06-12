import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { input } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `
The user wrote: "${input}"

Your task is to return at least 10 real proverbs, quotes, or meaningful sayings from various cultures around the world that match the user's emotion or situation.

For each result, provide:
1. The original quote (in its native language)
2. The language and country of origin
3. The translation of the quote into the language the user wrote in
4. The emotion or theme it relates to
5. If known, the name of the author

Use a diverse mix from global cultures. Return the result as a JSON array named "quotes".
        `,
        },
      ],
    });

    const output = response.choices[0].message.content;
    const quotes = JSON.parse(output.match(/\[.*\]/s)?.[0] || '[]');

    res.status(200).json({ quotes });
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
}