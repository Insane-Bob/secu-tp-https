import React, { useState } from 'react';
import { nosqlInjectionVuln } from '../routes/nosql';

export default function NoSQLVulnView() {
  const [input, setInput] = useState({ username: '', password: '' });
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setResult(nosqlInjectionVuln(input));
  }

  return (
    <section className="card">
      <h4>Injection NoSQL (Vulnérable)</h4>
      <form onSubmit={handleSubmit} className="demo-form">
        <label>
          Nom d'utilisateur :
          <input
            type="text"
            value={input.username}
            onChange={e => setInput({ ...input, username: e.target.value })}
            name="username"
            autoComplete="username"
          />
        </label>
        <label>
          Mot de passe :
          <input
            type="text"
            value={input.password}
            onChange={e => setInput({ ...input, password: e.target.value })}
            name="password"
            autoComplete="current-password"
          />
        </label>
        <button type="submit">Tester</button>
      </form>
      {result && (
        <pre className="result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}

