export default async function handler(req, res) {
  const { input } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `The user wrote: "${input}"

Please provide 10 short and relevant proverbs or meaningful quotes from any culture that match this situation.
For each one, include:
- Quote text
- Author (or write "Anonymous" if unknown)
- Original language and country
- Translated meaning (in the same language the user typed in)
- Related emotion or theme

Respond as a JSON array in the following format:
[
  {
    "text": "...",
    "author": "...",
    "language": "...",
    "country": "...",
    "translation": "...",
    "theme": "..."
  }
]`
        }
      ]
    })
  });

  const data = await response.json();

  try {
    const message = data.choices?.[0]?.message?.content;
    const quotes = JSON.parse(message);
    res.status(200).json({ quotes });
  } catch (error) {
    console.error("OpenAI response parsing failed", error);
    res.status(500).json({ quotes: [], error: "Failed to parse response from AI." });
  }
}
