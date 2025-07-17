// Simule une route pour l'injection NoSQL sécurisée
export function nosqlInjectionSecure({ username, password }) {
  // Sécurisé : filtre les caractères spéciaux
  const forbidden = /[$.{}]/;
  if (forbidden.test(username) || forbidden.test(password)) {
    return { success: false, error: 'Tentative d\'injection détectée' };
  }
  if (username === 'alice' && password === 'password1') {
    return { success: true, user: 'alice', message: 'Connexion réussie (sécurisée)' };
  }
  return { success: false, error: 'Identifiants invalides' };
}

