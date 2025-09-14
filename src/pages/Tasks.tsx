import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  Flag,
  Edit,
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Données d'exemple pour la démonstration
  const tasks = [
    {
      id: 1,
      title: 'Développer la nouvelle interface utilisateur',
      description: 'Créer une interface moderne et responsive pour le tableau de bord',
      assignee: 'Jean Dupont',
      priority: 'Haute',
      status: 'En cours',
      dueDate: '2024-02-15',
      createdDate: '2024-01-10',
      category: 'Développement'
    },
    {
      id: 2,
      title: 'Réviser les contrats clients',
      description: 'Examiner et mettre à jour tous les contrats en cours',
      assignee: 'Sophie Laurent',
      priority: 'Moyenne',
      status: 'À faire',
      dueDate: '2024-02-20',
      createdDate: '2024-01-12',
      category: 'RH'
    },
    {
      id: 3,
      title: 'Préparer la présentation Q1',
      description: 'Créer la présentation pour la réunion trimestrielle',
      assignee: 'Marie Martin',
      priority: 'Haute',
      status: 'Terminée',
      dueDate: '2024-01-30',
      createdDate: '2024-01-05',
      category: 'Management'
    },
    {
      id: 4,
      title: 'Optimiser les performances du site',
      description: 'Améliorer les temps de chargement et l\'expérience utilisateur',
      assignee: 'Pierre Durand',
      priority: 'Moyenne',
      status: 'En cours',
      dueDate: '2024-02-25',
      createdDate: '2024-01-15',
      category: 'Développement'
    },
    {
      id: 5,
      title: 'Formation équipe sur les nouvelles procédures',
      description: 'Organiser une session de formation pour l\'équipe',
      assignee: 'Sophie Laurent',
      priority: 'Basse',
      status: 'À faire',
      dueDate: '2024-03-01',
      createdDate: '2024-01-18',
      category: 'Formation'
    }
  ];

  const statuses = ['all', 'À faire', 'En cours', 'Terminée', 'Annulée'];
  const priorities = ['all', 'Haute', 'Moyenne', 'Basse'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Basse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'À faire':
        return 'bg-gray-100 text-gray-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'Moyenne':
        return <Flag className="h-4 w-4 text-yellow-500" />;
      case 'Basse':
        return <Flag className="h-4 w-4 text-green-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.id === tasks.findIndex(task => task.dueDate === dueDate))?.status.includes('Terminée');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="mt-1 text-sm text-gray-500">
            Suivez et gérez vos tâches et projets
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tâches
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Terminées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'Terminée').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Circle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En cours
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'En cours').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En retard
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(t => isOverdue(t.dueDate)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              {statuses.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Toutes priorités</option>
              {priorities.filter(p => p !== 'all').map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {task.status === 'Terminée' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p className={`text-sm font-medium ${task.status === 'Terminée' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignee}
                        <Calendar className="h-3 w-3 ml-3 mr-1" />
                        Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                        {isOverdue(task.dueDate) && (
                          <span className="ml-2 text-red-500 font-medium">EN RETARD</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {task.category}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tâche trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
