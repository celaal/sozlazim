// pages/index.js
't useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [input, setInput] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLanguage = () => {
    if (typeof navigator !== "undefined") {
      return navigator.language || "en";
    }
    return "en";
  };

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setQuotes([]);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, language: getLanguage() })
      });

      if (!response.ok) {
        throw new Error("API response not OK");
      }

      const data = await response.json();
      setQuotes(data.quotes);
    } catch (err) {
      setError("Something went wrong while fetching quotes.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white to-gray-100 text-gray-900">
      <Head>
        <title>What Would the World Say?</title>
      </Head>

      <h1 className="text-4xl font-bold mb-2">What Would the World Say?</h1>
      <p className="mb-6 text-lg text-gray-600">
        Write your situation or feeling below and discover meaningful quotes from all around the world.
      </p>

      <div className="flex items-center mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g. I feel betrayed by a friend"
          className="flex-grow p-3 rounded-l border border-gray-300 focus:outline-none focus:ring"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-3 rounded-r hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-6">
        {Array.isArray(quotes) && quotes.map((q, i) => (
          <li key={i} className="bg-white p-4 rounded shadow">
            <p className="text-xl font-semibold">“{q.quote}”</p>
            <p className="text-sm text-gray-700">{q.translation}</p>
            <div className="mt-2 text-sm text-gray-600">
              <span><strong>Language:</strong> {q.language}</span><br />
              {q.author && <span><strong>Author:</strong> {q.author}</span>}<br />
              {q.theme && <span><strong>Theme:</strong> {q.theme}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
