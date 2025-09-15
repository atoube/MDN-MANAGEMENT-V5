import React, { useState, useEffect, useCallback } from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  errorRate: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    apiResponseTime: 0,
    errorRate: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Mesurer le temps de chargement
  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    }
  }, []);

  // Mesurer l'utilisation mémoire
  const measureMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      setMetrics(prev => ({ ...prev, memoryUsage: Math.round(memoryUsage * 100) }));
    }
  }, []);

  // Mesurer le temps de réponse API
  const measureApiResponseTime = useCallback(async (apiCall: () => Promise<any>) => {
    const startTime = performance.now();
    try {
      await apiCall();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      setMetrics(prev => ({ ...prev, apiResponseTime: Math.round(responseTime) }));
    } catch (error) {
      setMetrics(prev => ({ ...prev, errorRate: prev.errorRate + 1 }));
    }
  }, []);

  // Optimiser les re-renders avec useMemo et useCallback
  const optimizeRender = useCallback((componentName: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
    };
  }, []);

  // Lazy loading des composants
  const lazyLoadComponent = useCallback((importFunction: () => Promise<any>) => {
    return React.lazy(importFunction);
  }, []);

  // Debounce pour les recherches
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Throttle pour les événements fréquents
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Cache pour les données API
  const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  const getCachedData = useCallback((key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: any, ttl: number = 300000) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, []);

  // Nettoyer le cache
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  // Démarrer le monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    measureLoadTime();
    measureMemoryUsage();
  }, [measureLoadTime, measureMemoryUsage]);

  // Arrêter le monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Obtenir les recommandations d'optimisation
  const getOptimizationRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.loadTime > 3000) {
      recommendations.push('Temps de chargement élevé - Considérez le code splitting');
    }

    if (metrics.renderTime > 16) {
      recommendations.push('Temps de rendu élevé - Optimisez les composants');
    }

    if (metrics.memoryUsage > 80) {
      recommendations.push('Utilisation mémoire élevée - Vérifiez les fuites mémoire');
    }

    if (metrics.apiResponseTime > 1000) {
      recommendations.push('Temps de réponse API élevé - Optimisez les requêtes');
    }

    if (metrics.errorRate > 5) {
      recommendations.push('Taux d\'erreur élevé - Vérifiez la gestion d\'erreurs');
    }

    return recommendations;
  }, [metrics]);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(measureMemoryUsage, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, measureMemoryUsage]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    measureApiResponseTime,
    optimizeRender,
    lazyLoadComponent,
    debounce,
    throttle,
    getCachedData,
    setCachedData,
    clearCache,
    getOptimizationRecommendations
  };
};
