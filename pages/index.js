// tailwind.css ile stillendirilmiş yeni tasarım dosyası
// pages/index.js
'tuse client'

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, language }),
      });
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error('Error:', err);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">
          Find Quotes That Match Your Emotion
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your emotion or situation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>English</option>
            <option>Turkish</option>
            <option>French</option>
            <option>German</option>
            <option>Spanish</option>
            <option>Arabic</option>
            <option>Italian</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-blue-600">Loading...</p>}

        <div className="space-y-6">
          {quotes.length > 0 && quotes.map((q, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-5 rounded-lg shadow-md"
            >
              <p className="font-semibold text-lg">{q.text}</p>
              <p className="italic text-gray-600">{q.translation}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p><strong>Language:</strong> {q.language}</p>
                {q.author && <p><strong>Author:</strong> {q.author}</p>}
                {q.theme && <p><strong>Theme:</strong> {q.theme}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
