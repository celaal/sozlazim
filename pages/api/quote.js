import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const input = req.body.input;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `The user wrote: "${input}".\n\nPlease return a list of 10 real quotes or proverbs from any country or culture (different if possible) that best match the emotion or theme of the user's sentence.\n\nFor each quote return:\n1. The original quote or proverb.\n2. The language and country of origin.\n3. The translated meaning in the user's language.\n4. The author if known.\n5. The associated emotion or theme.\n\nRespond only in JSON array format.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '[]');
    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}