import React, { useState } from 'react';
import './App.css';
import NoSQLVulnView from './views/NoSQLVulnView.jsx';
import NoSQLSecureView from './views/NoSQLSecureView.jsx';
import LFIVulnView from './views/LFIVulnView.jsx';
import LFISecureView from './views/LFISecureView.jsx';
import JWTAuthSecureView from './views/JWTAuthSecureView.jsx';
import JWTAuthVulnView from './views/JWTAuthVulnView.jsx';

const TABS = [
  { id: 'nosql-secure', label: 'Injection NoSQL (Sécurisée)' },
  { id: 'nosql-vuln', label: 'Injection NoSQL (Vulnérable)' },
  { id: 'lfi-secure', label: 'LFI (Sécurisée)' },
  { id: 'lfi-vuln', label: 'LFI (Vulnérable)' },
  { id: 'jwt', label: 'JWT Auth (Sécurisée)' },
  { id: 'jwt-vuln', label: 'JWT Auth (Vulnérable)' },
];

function TabNav({ tab, setTab }) {
  return (
    <nav className="tabs" role="tablist" aria-label="Sélection des tests">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          className={tab === id ? 'active' : ''}
          onClick={() => setTab(id)}
          aria-selected={tab === id}
          role="tab"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

function ExplanationCard({ title, children }) {
  return (
    <aside className="floating-card">
      <h3>{title}</h3>
      {children}
    </aside>
  );
}

function LFIExplanation({ vulnerable }) {
  return (
    <>
      <strong>Qu'est-ce qu'une LFI&nbsp;?</strong>
      <ul>
        <li>La <b>LFI</b> (Local File Inclusion) permet à un attaquant de lire des fichiers du serveur en manipulant un paramètre de chemin de fichier.</li>
      </ul>
      <strong>Comment tester&nbsp;?</strong>
      <ul>
        <li>Essayez d'abord avec un fichier autorisé, par exemple&nbsp;: <code>test-lfi.txt</code>.</li>
        <li>Essayez ensuite avec un chemin comme <code>../backend/index.js</code> pour voir si le serveur protège l'accès.</li>
        <li>Si le contenu du fichier s'affiche, la faille est présente. Sinon, le serveur est protégé.</li>
      </ul>
      <strong>Explication technique&nbsp;:</strong>
      <ul>
        {vulnerable ? (
          <li className="danger">Le backend lit le fichier demandé sans aucune validation du nom de fichier. Un attaquant peut utiliser des chemins relatifs (ex&nbsp;: <code>../</code>) pour lire des fichiers sensibles du serveur.</li>
        ) : (
          <li className="info">Le backend vérifie que le nom du fichier ne contient pas de séquences dangereuses (ex&nbsp;: <code>../</code>) et limite l'accès aux fichiers autorisés.</li>
        )}
      </ul>
    </>
  );
}

function NoSQLExplanation({ vulnerable }) {
  return (
    <>
      <strong>Qu'est-ce qu'une injection NoSQL&nbsp;?</strong>
      <ul>
        <li>Une <b>injection NoSQL</b> permet à un attaquant de manipuler une requête vers une base de données NoSQL (comme MongoDB) en injectant des opérateurs ou des objets inattendus.</li>
      </ul>
      <strong>Comment tester&nbsp;?</strong>
      <ul>
        <li>Essayez de vous connecter avec un utilisateur légitime (ex&nbsp;: <code>alice</code> / <code>password1</code>).</li>
        <li>Essayez d'injecter un objet JSON dans le champ mot de passe, par exemple&nbsp;: <code>{`{"$ne": null}`}</code>.</li>
        <li>Si la connexion réussit sans le bon mot de passe, la faille est présente.</li>
      </ul>
      <strong>Explication technique&nbsp;:</strong>
      <ul>
        {vulnerable ? (
          <li className="danger">Le backend ne filtre pas les entrées utilisateur. Un attaquant peut injecter des opérateurs NoSQL dans les champs du formulaire.</li>
        ) : (
          <li className="info">Le backend filtre et valide les entrées utilisateur, empêchant toute injection d'opérateurs NoSQL.</li>
        )}
      </ul>
    </>
  );
}

function JWTExplanation({ vulnerable }) {
  return (
    <>
      <strong>Qu'est-ce que JWT&nbsp;?</strong>
      <ul>
        <li>Le <b>JWT</b> (JSON Web Token) est un standard pour transmettre des informations de façon sécurisée entre deux parties.</li>
      </ul>
      <strong>Comment tester&nbsp;?</strong>
      <ul>
        <li>Connectez-vous avec un utilisateur légitime (ex&nbsp;: <code>alice</code> / <code>password1</code>).</li>
        <li>Récupérez le token JWT affiché après connexion.</li>
        <li>Utilisez ce token pour accéder à des routes protégées (ex&nbsp;: via Postman ou curl).</li>
      </ul>
      <strong>Explication technique&nbsp;:</strong>
      <ul>
        {vulnerable ? (
          <li className="danger">Le backend accepte un token statique ou non signé, ce qui permet à n'importe qui d'accéder aux routes protégées sans authentification réelle.</li>
        ) : (
          <li className="info">Le serveur génère un JWT à la connexion et le vérifie pour chaque requête protégée.</li>
        )}
      </ul>
    </>
  );
}

function MainContent({ tab }) {
  let explanation = null;
  let vulnView = null;
  if (tab === 'lfi-vuln') {
    explanation = <ExplanationCard title="LFI vulnérable"><LFIExplanation vulnerable /></ExplanationCard>;
    vulnView = <LFIVulnView />;
  } else if (tab === 'lfi-secure') {
    explanation = <ExplanationCard title="LFI sécurisée"><LFIExplanation vulnerable={false} /></ExplanationCard>;
    vulnView = <LFISecureView />;
  } else if (tab === 'nosql-vuln') {
    explanation = <ExplanationCard title="Injection NoSQL vulnérable"><NoSQLExplanation vulnerable /></ExplanationCard>;
    vulnView = <NoSQLVulnView />;
  } else if (tab === 'nosql-secure') {
    explanation = <ExplanationCard title="Injection NoSQL sécurisée"><NoSQLExplanation vulnerable={false} /></ExplanationCard>;
    vulnView = <NoSQLSecureView />;
  } else if (tab === 'jwt') {
    explanation = <ExplanationCard title="Authentification JWT (Sécurisée)"><JWTExplanation vulnerable={false} /></ExplanationCard>;
    vulnView = <JWTAuthSecureView />;
  } else if (tab === 'jwt-vuln') {
    explanation = <ExplanationCard title="Authentification JWT (Vulnérable)"><JWTExplanation vulnerable /></ExplanationCard>;
    vulnView = <JWTAuthVulnView />;
  }
  return (
    <div className="flex-row main-content">
      <div className="explanation-col">{explanation}</div>
      <div className="vuln-col">{vulnView}</div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('nosql-secure');
  return (
    <div>
      <TabNav tab={tab} setTab={setTab} />
      <MainContent tab={tab} />
    </div>
  );
}
