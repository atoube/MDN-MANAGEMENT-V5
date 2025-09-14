// Configuration centralisée de l'application
export const config = {
  // Configuration Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
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
  
  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
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
  supabase: {
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
  },
});