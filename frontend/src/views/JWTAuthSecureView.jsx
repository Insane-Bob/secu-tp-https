import React, { useState } from 'react';

export default function JWTAuthSecureView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setToken(null);
    try {
      const res = await fetch('/api/jwt-secure/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <div className="card main-card">
      <h4>Connexion JWT (Sécurisée)</h4>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      {token && (
        <div className="jwt-token">
          <strong>Token JWT&nbsp;:</strong>
          <pre>{token}</pre>
        </div>
      )}
      {error && <div className="danger">{error}</div>}
    </div>
  );
}

