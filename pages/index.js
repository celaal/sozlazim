import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Find Quotes That Match Your Emotion</h1>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your feeling or situation..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <button onClick={handleSearch} style={{ marginTop: '10px' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      <ul>
        {quotes.map((quote, index) => (
          <li key={index} style={{ margin: '1rem 0', lineHeight: 1.5 }}>
            <strong>Text:</strong> {quote.text} <br />
            <strong>Translation:</strong> {quote.translation} <br />
            <strong>Language:</strong> {quote.language} ({quote.country}) <br />
            {quote.author && <strong>Author:</strong>} {quote.author} <br />
            <strong>Theme:</strong> {quote.theme}
          </li>
        ))}
      </ul>
    </div>
  );
}