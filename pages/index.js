import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await res.json();
    setQuotes(data || []);
    setLoading(false);
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #1f1c2c, #928dab)', color: '#fff', fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>🌍 Söz Lazım</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Hislerini ya da durumu yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '0.8rem', fontSize: '1rem', borderRadius: '10px', border: 'none', width: '60%' }}
        />
        <button type="submit" style={{ background: '#ff6b6b', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', fontSize: '1rem', borderRadius: '10px', cursor: 'pointer' }}>
          Ara
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 0 12px rgba(0,0,0,0.2)' }}>
              <p><strong>📝 Orijinal:</strong> {q.text}</p>
              <p><strong>🌐 Çeviri:</strong> {q.translation}</p>
              <p><strong>🗺️ Ülke/Dil:</strong> {q.language}</p>
              <p><strong>👤 Yazar:</strong> {q.author || 'Bilinmiyor'}</p>
              <p><strong>🎭 Tema:</strong> {q.theme}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}