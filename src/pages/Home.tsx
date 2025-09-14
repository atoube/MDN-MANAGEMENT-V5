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
