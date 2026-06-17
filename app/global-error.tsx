'use client';

// Catches errors thrown in the root layout itself. Must render its own
// <html>/<body>. Kept dependency-free so it can never fail to render.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const startOver = () => {
    try {
      localStorage.removeItem('lifespan_save');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          background: '#e2e2e2',
          color: '#1a1a1a',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px' }}>😵</div>
        <h1 style={{ fontWeight: 900, fontSize: '28px', margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: '320px', fontWeight: 700, color: '#444', margin: 0 }}>
          Your saved game may be from an older version. Starting over will clear
          it and reload the game.
        </p>
        <button
          onClick={startOver}
          style={{
            padding: '14px 28px',
            background: '#46b93a',
            color: 'white',
            border: 'none',
            borderBottom: '4px solid #34972b',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          Start Over
        </button>
      </body>
    </html>
  );
}
