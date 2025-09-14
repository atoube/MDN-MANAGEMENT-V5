#!/bin/bash

# Créer Home.tsx
cat > src/pages/Home.tsx << 'EOL'
import React from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestion des Employés',
      description: 'Gérez facilement vos employés, leurs informations et leurs performances.',
    },
    {
      icon: FileText,
      title: 'Gestion de Projets',
      description: 'Suivez vos projets de A à Z avec des outils de gestion avancés.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Rapports',
      description: 'Analysez les performances avec des tableaux de bord détaillés.',
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Vos données sont protégées avec les meilleures pratiques de sécurité.',
    },
    {
      icon: Clock,
      title: 'Temps Réel',
      description: 'Suivez les activités en temps réel pour une meilleure réactivité.',
    },
    {
      icon: CheckCircle,
      title: 'Fiabilité',
      description: 'Une solution éprouvée et fiable pour votre entreprise.',
    },
  ];

  const stats = [
    { label: 'Employés Gérés', value: '500+' },
    { label: 'Projets Terminés', value: '1,200+' },
    { label: 'Clients Satisfaits', value: '98%' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Bienvenue dans{' '}
          <span className="text-blue-600">MADON Management Suite</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
          La solution complète pour gérer votre entreprise. Gérez vos employés, 
          projets, finances et bien plus encore avec une interface moderne et intuitive.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Commencer maintenant
          </button>
          <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            En savoir plus <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12 rounded-lg shadow">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Fonctionnalités Principales
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tout ce dont vous avez besoin pour gérer votre entreprise efficacement
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-lg">
        <div className="px-6 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Rejoignez des milliers d'entreprises qui font confiance à MADON Suite 
              pour gérer leurs opérations quotidiennes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Essai gratuit
              </button>
              <button className="text-sm font-semibold leading-6 text-white hover:text-blue-100">
                Contacter les ventes <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
EOL

# Créer Login.tsx
cat > src/pages/Login.tsx << 'EOL'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'authentification
    setTimeout(() => {
      if (email === 'admin@madon.com' && password === 'admin123') {
        // Sauvegarder l'utilisateur connecté
        const user = {
          id: '1',
          email: email,
          name: 'Administrateur',
          role: 'admin',
          first_name: 'Admin',
          last_name: 'MADON'
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à MADON Suite
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre tableau de bord de gestion
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              <strong>Compte de démonstration :</strong>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Email: admin@madon.com<br />
              Mot de passe: admin123
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
EOL

# Créer NotFound.tsx
cat > src/pages/NotFound.tsx << 'EOL'
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page non trouvée
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Désolé, nous n'avons pas pu trouver la page que vous recherchez.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
EOL

echo "Fichiers créés avec succès !"
