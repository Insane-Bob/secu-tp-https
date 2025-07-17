// Simule une route pour l'injection NoSQL vulnérable
export function nosqlInjectionVuln({ username, password }) {
  // Vulnérable : ne filtre rien
  if (
    username === 'alice' && password === 'password1' ||
    typeof username === 'object' || typeof password === 'object'
  ) {
    return { success: true, user: 'alice', message: 'Connexion réussie (vulnérable)' };
  }
  // Injection possible si { "$ne": null } est passé
  if (
    username && typeof username === 'string' && username.includes('$ne') ||
    password && typeof password === 'string' && password.includes('$ne')
  ) {
    return { success: true, user: 'alice', message: 'Connexion réussie (vulnérable, injection)' };
  }
  return { success: false, error: 'Identifiants invalides' };
}

