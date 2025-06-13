// pages/index.js
'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setQuotes([]);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      if (!Array.isArray(data.quotes)) {
        setError('No quotes found.');
      } else {
        setQuotes(data.quotes);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching quotes.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 p-6 text-gray-800">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 tracking-tight">What Would the World Say?</h1>
        <p className="text-lg mb-8">Write your situation or feeling below and discover meaningful quotes from all around the world.</p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-8">
          <input
            className="w-full sm:w-2/3 p-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="e.g. I helped him but he didn’t help me back"
          />
          <button
            onClick={handleSearch}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-blue-600 mb-4">Loading quotes...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-md text-left">
              <p className="font-semibold text-lg mb-1">🗣️ {q.text}</p>
              <p className="italic text-gray-700 mb-2">💬 {q.translation}</p>
              <div className="text-sm text-gray-500">
                <p>🌐 <strong>Language:</strong> {q.language}</p>
                {q.author && <p>👤 <strong>Author:</strong> {q.author}</p>}
                {q.theme && <p>🎯 <strong>Theme:</strong> {q.theme}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
