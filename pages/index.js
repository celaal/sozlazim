""import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQuotes = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setQuotes([]);

    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const data = await response.json();
    setQuotes(data.quotes || []);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getQuotes();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Find Quotes That Match Your Emotion</h1>
      <textarea
        className="w-full max-w-xl p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
        rows={4}
        placeholder="Type what you're feeling or experiencing and press Enter..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {loading && <p className="mt-4 text-gray-700">Loading...</p>}
      <div className="mt-6 w-full max-w-3xl space-y-4">
        {quotes.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-lg font-semibold text-gray-800">“{item.text}”</p>
            {item.author && <p className="text-sm text-gray-600 mt-1">— {item.author}</p>}
            <p className="text-sm text-gray-500 mt-1">🌍 {item.language} / {item.country}</p>
            <p className="text-sm text-gray-500 mt-1">🗣️ {item.translation}</p>
            <p className="text-sm text-gray-500 mt-1">🎯 Theme: {item.theme}</p>
          </div>
        ))}
      </div>
    </main>
  );
}""
