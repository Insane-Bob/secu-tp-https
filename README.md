# 🛡️ Ilyam - Demo Vulnérabilités Web (NoSQL, JWT, LFI)

**URL DU SITE :** https://ilyam.revision-ai.com/

Ce projet a pour objectif de démontrer **trois vulnérabilités web** courantes dans une application Node.js avec MongoDB, à travers un backend Express minimaliste.

> ⚠️ Ce projet est éducatif. Ne jamais déployer ce type de code vulnérable en production.

---

## ✨ Contenu du projet

Le backend expose trois types de failles applicatives :

- ✅ **NoSQL Injection** : manipulation des requêtes MongoDB via des champs non filtrés.
- ✅ **JWT Malveillant** : signature HS256 vs RS256 manipulable si mauvaise vérification.
- ✅ **LFI (Local File Inclusion)** : lecture arbitraire de fichiers locaux via des chemins non filtrés.

Le tout est hébergé en HTTPS grâce à un proxy Nginx avec certificat SSL auto-signé.

---

## 🧠 Objectifs pédagogiques

Ce projet a pour but d’apprendre :

1. Comment fonctionnent certaines failles web en pratique.
2. Quelles erreurs de développement peuvent les provoquer.
3. Comment y remédier avec des vérifications simples.
4. Comment déployer un serveur Node.js avec HTTPS sur une machine distante.
5. Comment utiliser `curl`, `Postman`, ou une interface React pour tester les failles.

---

## 🧰 Prérequis

- Linux (Debian/Ubuntu de préférence)
- Node.js ≥ 18
- MongoDB (local ou distant)
- Nginx installé
- Git, curl

---

## 📁 Structure du projet

```
ilyam-revision-ai-backend/
├── index.js              # Code principal Express
├── files/                # Répertoire de test pour LFI
└── README.md             # Ce fichier
```

---

## ⚙️ Étape 1 – Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/ilyam-revision-ai-backend.git
cd ilyam-revision-ai-backend
```

---

## 📦 Étape 2 – Installer les dépendances Node.js

```bash
npm install
```

---

## 🧪 Étape 3 – Tester le backend en local (port 3001)

Avant toute configuration Nginx :

```bash
node index.js
```

Par défaut, l’API écoute sur [http://localhost:3001](http://localhost:3001)

---

## 🛠️ Étape 4 – Lancer MongoDB

Assurez-vous que MongoDB est installé et fonctionne :

```bash
sudo systemctl start mongod
```

Vérifiez qu’il écoute sur le port 27017 :

```bash
ss -tuln | grep 27017
```

---

## 🔐 Étape 5 – Ajouter un certificat SSL (HTTPS avec Nginx)

### 📁 A. Générer un certificat SSL auto-signé

```bash
sudo mkdir -p /etc/ssl/ilyam/
cd /etc/ssl/ilyam/

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ilyam.key -out ilyam.crt \
  -subj "/C=FR/ST=France/L=Paris/O=Demo/OU=Web/CN=ilyam-revision-ai.com"
```

Cela génère deux fichiers :
- `/etc/ssl/ilyam/ilyam.crt`
- `/etc/ssl/ilyam/ilyam.key`

---

### 🧾 B. Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/ilyam
```

Contenu :

```nginx
server {
    listen 443 ssl;
    server_name ilyam-revision-ai.com;

    ssl_certificate /etc/ssl/ilyam/ilyam.crt;
    ssl_certificate_key /etc/ssl/ilyam/ilyam.key;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez le site et redémarrez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/ilyam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🌐 Étape 6 – Accéder à l’API en HTTPS

- Test direct :  
  ```bash
  curl -k https://ilyam-revision-ai.com/login
  ```

- Attention : l’option `-k` est nécessaire car le certificat est auto-signé.

---

## 🔎 Étape 7 – Test des failles

### 🧨 NoSQL Injection

#### Endpoint vulnérable :
```bash
POST /nosql-injection-vuln
Content-Type: application/json

{
  "username": { "$ne": null }
}
```

> ✅ En version vulnérable, cette requête renvoie un utilisateur sans mot de passe valide.

#### Endpoint sécurisé :
```bash
POST /nosql-injection
Content-Type: application/json

{
  "username": { "$ne": null }
}
```

> ❌ En version sécurisée, la requête est bloquée : `"Invalid username"`.

---

### 📂 LFI (Local File Inclusion)

Assurez-vous d’avoir un fichier dans `files/test.txt`.

#### Vulnérable :
```bash
GET /lfi-vuln?filename=../../etc/passwd
```

> ✅ Cela renvoie `/etc/passwd` (dangereux).

#### Sécurisé :
```bash
GET /lfi?filename=../../etc/passwd
```

> ❌ Renvoie `"Access denied"`.

---

### 🔐 JWT vulnérable

Exemple de manipulation typique :

1. Se connecter via `/login` pour obtenir un token valide.
2. Remplacer la signature par `'none'` ou falsifier l'algorithme (`RS256` → `HS256`) si le backend est mal configuré.
3. Décoder avec [jwt.io](https://jwt.io).

> ⚠️ **Ce backend ne montre pas encore cette vulnérabilité, mais vous pouvez l’ajouter.** Je peux vous aider à le faire.

---

## 👥 Crédits utilisateurs fictifs

```json
[
  { "username": "alice", "password": "password1" },
  { "username": "bob", "password": "password2" }
]
```

---

## 🚀 Déploiement permanent

Utilisez `pm2` pour exécuter le backend de manière persistante :

```bash
npm install -g pm2
pm2 start index.js --name ilyam-backend
pm2 save
pm2 startup
```

---

## ✅ Sécurité minimale recommandée

- Ne jamais utiliser de chaînes en entrée directement dans une requête Mongo.
- Toujours filtrer les chemins de fichiers dans les routes `GET`.
- Ne jamais faire confiance à un `alg` dans un token JWT sans validation manuelle.
- Toujours utiliser HTTPS, même pour des tests.

---
