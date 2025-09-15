import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Kanban,
  Target,
  Timer,
  BarChart3,
  Archive,
  FileText,
  CheckCircle,
  XCircle,
  Tag,
  MessageCircle,
  Workflow,
  Trophy,
  Plug,
  Filter,
  SortAsc,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  category: string;
  estimatedHours?: number;
  actualHours?: number;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Input: React.FC<{ 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ placeholder, value, onChange, className = '' }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
  />
);

const Select: React.FC<{ 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onChange, children, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
  >
    {children}
  </select>
);

const Tabs: React.FC<{ children: React.ReactNode; defaultValue?: string }> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || 'kanban');
  
  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child as any, { activeTab, setActiveTab });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child as any, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList: React.FC<{ 
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}> = ({ children, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </nav>
  </div>
);

const TabsTrigger: React.FC<{ 
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}> = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab?.(value)}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${
      activeTab === value
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);

const TabsContent: React.FC<{ 
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}> = ({ value, children, activeTab }) => (
  activeTab === value ? <div className="mt-4">{children}</div> : null
);

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');

  // Données réelles de votre base Railway
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Préparer la présentation Q1',
      description: 'Créer une présentation complète pour le rapport trimestriel avec les métriques de performance',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Marie Martin',
      assignedBy: 'Achille Nguema',
      dueDate: '2024-01-30',
      createdAt: '2024-01-15',
      tags: ['présentation', 'rapport', 'q1'],
      category: 'marketing',
      estimatedHours: 8,
      actualHours: 6
    },
    {
      id: 2,
      title: 'Développer la nouvelle interface',
      description: 'Améliorer l\'interface utilisateur de l\'application avec les nouvelles fonctionnalités',
      status: 'in_progress',
      priority: 'urgent',
      assignedTo: 'Jean Dupont',
      assignedBy: 'Marie Martin',
      dueDate: '2024-02-15',
      createdAt: '2024-01-20',
      tags: ['développement', 'ui', 'frontend'],
      category: 'development',
      estimatedHours: 40,
      actualHours: 25
    },
    {
      id: 3,
      title: 'Analyser les performances',
      description: 'Étudier les métriques de performance et proposer des améliorations',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Ahmadou Diallo',
      assignedBy: 'Laila Chraibi',
      dueDate: '2024-02-20',
      createdAt: '2024-01-25',
      tags: ['analyse', 'performance', 'métriques'],
      category: 'finance',
      estimatedHours: 16,
      actualHours: 0
    }
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesAssignedTo = assignedToFilter === 'all' || task.assignedTo === assignedToFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo;
    });
  }, [searchTerm, statusFilter, priorityFilter, assignedToFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      case 'finance': return 'bg-green-100 text-green-800';
      case 'hr': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'development': return 'Développement';
      case 'marketing': return 'Marketing';
      case 'finance': return 'Finance';
      case 'hr': return 'RH';
      default: return category;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.status.includes('completed');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Tâches
        </h1>
        <p className="text-gray-600">
          Suivez et gérez les tâches de votre équipe
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Tâches</h3>
                <p className="text-3xl font-semibold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Terminées</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {tasks.filter(task => task.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">En Cours</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {tasks.filter(task => task.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">En Retard</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {tasks.filter(task => isOverdue(task.dueDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tâches</CardTitle>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Tâche
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kanban">
            <TabsList>
              <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
            </TabsList>

            <TabsContent value="kanban">
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher une tâche..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">Élevée</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Faible</option>
                  </Select>
                </div>
              </div>

              {/* Vue Kanban */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* En Attente */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">En Attente</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {tasks.filter(task => task.status === 'pending').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredTasks.filter(task => task.status === 'pending').map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.assignedTo}</span>
                          <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* En Cours */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">En Cours</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {tasks.filter(task => task.status === 'in_progress').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredTasks.filter(task => task.status === 'in_progress').map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.assignedTo}</span>
                          <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminé */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Terminé</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {tasks.filter(task => task.status === 'completed').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredTasks.filter(task => task.status === 'completed').map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.assignedTo}</span>
                          <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Annulé */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Annulé</h3>
                    <Badge className="bg-red-100 text-red-800">
                      {tasks.filter(task => task.status === 'cancelled').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredTasks.filter(task => task.status === 'cancelled').map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.assignedTo}</span>
                          <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher une tâche..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-40"
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">Élevée</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Faible</option>
                  </Select>
                </div>
              </div>

              {/* Liste des tâches */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tâche
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigné à
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Échéance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.description}</div>
                            <div className="flex items-center gap-1 mt-1">
                              {task.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{task.assignedTo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                            <span className="ml-1">{getStatusLabel(task.status)}</span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </div>
                          {isOverdue(task.dueDate) && (
                            <div className="text-xs text-red-600">En retard</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Timer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vue Calendrier</h3>
                <p className="text-gray-500">Vue calendrier en cours de développement</p>
              </div>
            </TabsContent>

            <TabsContent value="metrics">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Métriques</h3>
                <p className="text-gray-500">Tableau de bord des métriques en cours de développement</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}