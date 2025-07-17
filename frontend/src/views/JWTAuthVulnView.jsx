import React, { useState } from 'react';

export default function JWTAuthVulnView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Faux token statique pour la version vulnérable
  const STATIC_FAKE_TOKEN = 'FAKE.JWT.TOKEN';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setToken(null);
    try {
      // Simule une "connexion" qui donne toujours le même token
      if (username && password) {
        setToken(STATIC_FAKE_TOKEN);
      } else {
        setError('Veuillez remplir les champs');
      }
    } catch (err) {
      setError('Erreur inattendue');
    }
  };

  return (
    <div className="card main-card">
      <h4>Connexion JWT (Vulnérable)</h4>
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

