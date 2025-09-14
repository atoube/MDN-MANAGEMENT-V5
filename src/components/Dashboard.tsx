import React from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Employés',
      value: '24',
      change: '+2.1%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Projets Actifs',
      value: '12',
      change: '+5.4%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Revenus Mensuels',
      value: '€45,231',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Taux de Réussite',
      value: '94.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'employee',
      message: 'Nouvel employé ajouté: Jean Dupont',
      time: 'Il y a 2 heures',
    },
    {
      id: 2,
      type: 'project',
      message: 'Projet "Site Web" terminé avec succès',
      time: 'Il y a 4 heures',
    },
    {
      id: 3,
      type: 'document',
      message: 'Document "Contrat 2024" mis à jour',
      time: 'Il y a 6 heures',
    },
    {
      id: 4,
      type: 'meeting',
      message: 'Réunion d\'équipe programmée pour demain',
      time: 'Il y a 8 heures',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de votre entreprise et des performances
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Chart */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Mensuelle
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Graphique de performance</p>
              <p className="text-sm text-gray-400">Données en cours de chargement...</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Activités Récentes
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Users className="h-5 w-5 mr-2" />
            Ajouter Employé
          </button>
          <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <FileText className="h-5 w-5 mr-2" />
            Nouveau Projet
          </button>
          <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Calendar className="h-5 w-5 mr-2" />
            Planifier Réunion
          </button>
          <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <DollarSign className="h-5 w-5 mr-2" />
            Gérer Finances
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;