export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that returns meaningful proverbs and quotes from around the world. For each user input, return 10 items with these fields: text, translation, language, country, author (if known), and theme.'
          },
          {
            role: 'user',
            content: `User input: "${input}". Please return 10 matching quotes as JSON array with fields: text, translation, language, country, author, theme.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await completion.json();

    const responseText = data.choices?.[0]?.message?.content;
    let quotes = [];

    try {
      quotes = JSON.parse(responseText);
    } catch (e) {
      console.error('JSON parse error:', e);
    }

    res.status(200).json({ quotes });
  } catch (error) {
    console.error('API ERROR:', error);
    res.status(500).json({ error: 'Something went wrong with the OpenAI API.' });
  }
}