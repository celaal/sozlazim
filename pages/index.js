// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const data = await res.json();
      setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching quotes.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchQuotes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Find Quotes That Match Your Emotion
      </h1>
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your emotion or situation..."
            className="w-full p-4 pr-12 rounded-lg shadow border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchQuotes}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            aria-label="Search"
          >
            🔍
          </button>
        </div>

        {loading && <p className="text-blue-700">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {Array.isArray(quotes) && quotes.length > 0 ? (
          <ul className="space-y-6">
            {quotes.map((quote, idx) => (
              <li key={idx} className="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Text:</strong> {quote.text || 'N/A'}</p>
                <p><strong>Translation:</strong> {quote.translation || 'N/A'}</p>
                <p><strong>Language:</strong> {quote.language || 'Unknown'}</p>
                {quote.author && <p><strong>Author:</strong> {quote.author}</p>}
                <p><strong>Theme:</strong> {quote.theme || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-gray-600 text-center">No quotes found.</p>
        )}
      </div>
    </div>
  );
}
