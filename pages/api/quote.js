import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const systemPrompt = `
You are a global wisdom expert. A user will provide a situation or emotional experience.
Your task is to return 10 famous quotes or proverbs from a wide variety of cultures and languages.

For each item, respond in this JSON structure:
[
  {
    "quote": "original quote in native language",
    "translation": "translated version in user's language",
    "language": "language and country of origin",
    "author": "person or culture",
    "theme": "emotion or theme like love, trust, betrayal"
  }
  ...
]`;

    const userPrompt = `User input: "${input}"\nPlease provide 10 culturally diverse quotes.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const output = completion.data.choices[0].message.content;

    const jsonStart = output.indexOf("[");
    const jsonEnd = output.lastIndexOf("]") + 1;
    const jsonString = output.slice(jsonStart, jsonEnd);

    const quotes = JSON.parse(jsonString);
    res.status(200).json({ quotes });
  } catch (error) {
    console.error("QUOTE API ERROR:", error);
    res.status(500).json({ error: "Failed to fetch quotes", detail: error.message });
  }
}
