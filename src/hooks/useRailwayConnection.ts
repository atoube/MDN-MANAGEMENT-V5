import { useState, useEffect } from 'react';

interface RailwayConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

interface ConnectionStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useRailwayConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const [config] = useState<RailwayConfig>({
    host: import.meta.env.VITE_RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
    port: parseInt(import.meta.env.VITE_RAILWAY_DB_PORT || '26824'),
    user: import.meta.env.VITE_RAILWAY_DB_USER || 'root',
    password: import.meta.env.VITE_RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
    database: import.meta.env.VITE_RAILWAY_DB_NAME || 'railway',
    ssl: import.meta.env.VITE_RAILWAY_DB_SSL === 'true'
  });

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/test-connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          isConnected: true,
          isLoading: false,
          error: null,
          lastChecked: new Date()
        });
        return data;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion inconnue';
      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      throw error;
    }
  };

  const executeQuery = async (endpoint: string, options: RequestInit = {}) => {
    if (!status.isConnected) {
      await testConnection();
    }

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la requête ${endpoint}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    ...status,
    config,
    testConnection,
    executeQuery
  };
};
