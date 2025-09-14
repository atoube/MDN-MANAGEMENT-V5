// Configuration centralisée de l'application
export const config = {
  // Configuration de l'application
  app: {
    name: 'MADON Management Suite',
    version: '5.0.0',
    environment: 'production',
    isDev: false,
  },
  
  // Configuration des fonctionnalités
  features: {
    realtime: false,
    analytics: false,
    debug: false,
  },
  
  // Configuration des API
  api: {
    timeout: 10000,
    retries: 3,
  },
} as const;

// Fonction pour vérifier si la configuration est valide
export const validateConfig = () => {
  return true;
};

// Fonction pour obtenir la configuration en mode développement
export const getDevConfig = () => ({
  ...config,
  app: {
    ...config.app,
    environment: 'development',
    isDev: true,
  },
  features: {
    ...config.features,
    debug: true,
  },
});