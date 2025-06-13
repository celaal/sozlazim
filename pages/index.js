import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setQuotes([]);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      const safeQuotes = Array.isArray(data.quotes) ? data.quotes : [];
      setQuotes(safeQuotes);
    } catch (err) {
      console.error(err);
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
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Find Quotes That Match Your Emotion</h1>

      <div style={{ display: 'flex', maxWidth: '700px' }}>
        <input
          type="text"
          placeholder="Write how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
        />
        <button onClick={fetchQuotes} style={{ padding: '1rem' }}>🔍</button>
      </div>

      {loading && <p>Loading...</p>}

      <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
        {quotes.map((quote, i) => (
          <li key={i} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <p><strong>📝 Text:</strong> {quote.text}</p>
            <p><strong>🌐 Translation:</strong> {quote.translation}</p>
            <p><strong>📍 Language:</strong> {quote.language} ({quote.country})</p>
            {quote.author && <p><strong>👤 Author:</strong> {quote.author}</p>}
            {quote.theme && <p><strong>🎭 Theme:</strong> {quote.theme}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
