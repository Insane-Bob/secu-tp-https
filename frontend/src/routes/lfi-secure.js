// Simule une route LFI sécurisée
export function lfiSecure({ filename }) {
  // Sécurisé : filtre les chemins dangereux
  if (!filename) return { error: 'Aucun fichier spécifié' };
  if (filename.includes('../') || filename.startsWith('/')) {
    return { error: 'Accès refusé : chemin non autorisé' };
  }
  if (filename === 'test-lfi.txt') {
    return { content: 'Ceci est un fichier de test LFI.' };
  }
  return { error: 'Fichier non trouvé' };
}

