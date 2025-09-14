// Configuration centralisée de l'application
export const config = {
    url: import.meta.env.    anonKey: import.meta.env.    serviceRoleKey: import.meta.env.  },
  
  // Configuration de l'application
  app: {
    name: import.meta.env.VITE_PROJECT_NAME || 'MADON Marketplace',
    version: '4.0.0',
    environment: import.meta.env.NODE_ENV || 'development',
    isDev: import.meta.env.NODE_ENV === 'development',
  },
  
  // Configuration des fonctionnalités
  features: {
    realtime: true,
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
  
  if (!config.    errors.push('  }
  
  if (!config.    errors.push('  }
  
  if (errors.length > 0) {
    console.warn('Configuration invalide:', errors);
    return false;
  }
  
  return true;
};

// Fonction pour obtenir la configuration en mode développement
export const getDevConfig = () => ({
  ...config,
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  },
});
