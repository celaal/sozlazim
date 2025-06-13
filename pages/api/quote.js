import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, language } = req.body;

  if (!input || !language) {
    return res.status(400).json({ error: 'Missing input or language' });
  }

  try {
    const prompt = `
You are a multilingual quote expert. The user is feeling or saying: "${input}".
Please return a list of 10 culturally diverse and widely recognized proverbs or quotes related to this feeling.

For each quote, include:
1. Text: the original quote in its native language.
2. Translation: translated into ${language}.
3. Language: language + country of origin.
4. Author: if known.
5. Theme: the emotional or philosophical theme of the quote.

Respond as a pure JSON array like this:
[
  {
    "text": "...",
    "translation": "...",
    "language": "...",
    "author": "...",
    "theme": "..."
  },
  ...
]
Only return valid JSON.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reply = response.data.choices[0].message.content;

    // Try parsing the response as JSON
    const parsed = JSON.parse(reply);
    return res.status(200).json({ quotes: parsed });

  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
