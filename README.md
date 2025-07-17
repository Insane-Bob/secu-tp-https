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

## 📁 Structure du projet

```
frontend/
├── App.jsx               # Code principal de l'application
├── routes/               # Répertoire des composants pour les pages des failles de sécurité
├── views/                # Répertoire des vues des failles
└── README.md             # Ce fichier
```

---

## 🔐 Comment j'ai ajouté un certificat SSL (HTTPS avec Nginx) à mon VPS de chez Scaleway ?

### 📁 A. Génération d'un certificat SSL avec Let's Encrypt & Certbot

## 🔐 Mise en place du certificat SSL avec Let's Encrypt & Certbot

Pour sécuriser l'application avec HTTPS, j'ai utilisé **Let's Encrypt** via **Certbot**, en mode automatique avec Nginx. Voici les étapes que j'ai suivies :

1. **Installation de Certbot et du plugin Nginx** :
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
Vérification que Nginx fonctionne bien et que le site est accessible via HTTP (http://ilyam.revision-ai.com).

Obtention automatique du certificat avec redirection HTTPS :

bash
Copier
Modifier
sudo certbot --nginx -d ilyam.revision-ai.com
Certbot a automatiquement :

généré un certificat SSL/TLS

configuré Nginx pour rediriger le trafic HTTP vers HTTPS

rechargé Nginx pour appliquer les changements

Vérification du bon fonctionnement :

Accès au site via https://ilyam.revision-ai.com

Icône de cadenas visible dans le navigateur

Renouvellement automatique :

Certbot installe une tâche cron par défaut.

Pour tester manuellement :

bash
Copier
Modifier
sudo certbot renew --dry-run
👉 Cette méthode permet d’avoir un HTTPS gratuit, automatique et reconnu, sans configuration manuelle de certificat.


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

## 🌐 Vérification du certificat et du SSL (HTTPS)

- Visite du site https://ilyam-revision-ai.com
- Vérifier si le cadenas est bien fermé

---

## 🔎 Test des failles avec interface 

- Visiter le site  https://ilyam-revision-ai.com afin de tester les différentes failles

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

## ✅ Sécurité minimale recommandée

- Ne jamais utiliser de chaînes en entrée directement dans une requête Mongo.
- Toujours filtrer les chemins de fichiers dans les routes `GET`.
- Ne jamais faire confiance à un `alg` dans un token JWT sans validation manuelle.
- Toujours utiliser HTTPS, même pour des tests.

---
