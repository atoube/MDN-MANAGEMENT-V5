import React, { useState } from 'react';
import { AlertTriangle, X, Database, Wifi, WifiOff } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Mode Démo Activé
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  L'application fonctionne actuellement en mode démo avec des données d'exemple. 
                  Les API routes Railway sont en cours de déploiement sur Vercel.
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <WifiOff className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-xs">API Railway: En cours de déploiement</span>
                  </div>
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-xs">Données: Mode démo actif</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 flex-shrink-0"
            >
              <X className="h-4 w-4 text-yellow-400 hover:text-yellow-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
