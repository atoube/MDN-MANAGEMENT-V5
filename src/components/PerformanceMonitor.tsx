import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { 
  Activity, 
  Zap, 
  HardDrive, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { usePerformance } from '../hooks/usePerformance';

export const PerformanceMonitor: React.FC = () => {
  const {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getOptimizationRecommendations,
    clearCache
  } = usePerformance();

  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (value <= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const recommendations = getOptimizationRecommendations();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Monitoring des Performances
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Détails'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Cache
            </Button>
            <Button
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isMonitoring ? 'Arrêter' : 'Démarrer'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Métriques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Chargement</span>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}>
              {metrics.loadTime}ms
            </div>
            {getStatusIcon(metrics.loadTime, { good: 1000, warning: 3000 })}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-purple-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Rendu</span>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.renderTime, { good: 16, warning: 50 })}`}>
              {metrics.renderTime}ms
            </div>
            {getStatusIcon(metrics.renderTime, { good: 16, warning: 50 })}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <HardDrive className="h-5 w-5 text-orange-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Mémoire</span>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 80 })}`}>
              {metrics.memoryUsage}%
            </div>
            {getStatusIcon(metrics.memoryUsage, { good: 50, warning: 80 })}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">API</span>
            </div>
            <div className={`text-2xl font-bold ${getStatusColor(metrics.apiResponseTime, { good: 500, warning: 1000 })}`}>
              {metrics.apiResponseTime}ms
            </div>
            {getStatusIcon(metrics.apiResponseTime, { good: 500, warning: 1000 })}
          </div>
        </div>

        {/* Détails étendus */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Graphiques de performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tendances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance générale</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temps de réponse</span>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        <span className="text-sm text-red-600">-5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Utilisation mémoire</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-yellow-600 mr-1" />
                        <span className="text-sm text-yellow-600">+3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statut</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monitoring</span>
                      <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {isMonitoring ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cache</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        Actif
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Optimisations</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        Activées
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommandations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    Recommandations d'Optimisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions d'optimisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions d'Optimisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex flex-col items-center p-4">
                    <RefreshCw className="h-6 w-6 mb-2" />
                    <span className="text-sm">Vider le cache</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4">
                    <Zap className="h-6 w-6 mb-2" />
                    <span className="text-sm">Optimiser les images</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center p-4">
                    <HardDrive className="h-6 w-6 mb-2" />
                    <span className="text-sm">Nettoyer la mémoire</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
