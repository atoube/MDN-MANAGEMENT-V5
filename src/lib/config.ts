// Configuration centralisée de l'application
export const config = {
  // Configuration de la base de données MySQL/MariaDB
  database: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
    user: import.meta.env.VITE_DB_USER || 'root',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    database: import.meta.env.VITE_DB_NAME || 'MDN_SUITE',
    connectionLimit: 10,
    queueLimit: 0,
  },
  
  // Configuration de l'application
  app: {
    name: import.meta.env.VITE_PROJECT_NAME || 'MADON Management Suite',
    version: '5.0.0',
    environment: import.meta.env.NODE_ENV || 'development',
    isDev: import.meta.env.NODE_ENV === 'development',
  },
  
  // Configuration des fonctionnalités
  features: {
    realtime: false, // Pas de temps réel sans Supabase
    analytics: false,
    debug: import.meta.env.NODE_ENV === 'development',
  },
  
  // Configuration des API
  api: {
    timeout: 10000,
    retries: 3,
  },
} as const;

// Fonction pour vérifier si la configuration est valide
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.database.host) {
    errors.push('VITE_DB_HOST is required');
  }
  
  if (!config.database.database) {
    errors.push('VITE_DB_NAME is required');
  }
  
  if (errors.length > 0) {
    console.warn('Configuration invalide:', errors);
    return false;
  }
  
  return true;
};

// Fonction pour obtenir la configuration en mode développement
export const getDevConfig = () => ({
  ...config,
  database: {
    ...config.database,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'MDN_SUITE',
  },
});