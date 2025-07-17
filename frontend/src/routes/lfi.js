// Simule une route LFI vulnérable
export function lfiVuln({ filename }) {
  // Vulnérable : pas de filtre, accès à tout
  if (!filename) return { error: 'Aucun fichier spécifié' };
  if (filename === 'test-lfi.txt') {
    return { content: 'Ceci est un fichier de test LFI.' };
  }
  // Simule la lecture de fichiers système
  if (filename.includes('../')) {
    return { content: 'MONGODB_VERSION=4.4.6\nNODE_VERSION=14.15.1' };
  }
  return { error: 'Fichier non trouvé' };
}

