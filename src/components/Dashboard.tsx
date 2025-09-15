import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  TrendingUp,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Plus,
  Activity,
  Settings,
  Eye,
  EyeOff,
  File
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { useTasks } from '../hooks/useTasks';
import { useRailwayConnection } from '../hooks/useRailwayConnection';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-gray-500">
                <span className={`inline-flex items-center ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    trend.isPositive ? '' : 'rotate-180'
                  }`} />
                  {Math.abs(trend.value)}%
                </span>
                <span className="ml-2">vs mois dernier</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
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

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { employees, loading: employeesLoading } = useEmployees();
  const { tasks, loading: tasksLoading, getTaskStats } = useTasks();
  const { isConnected, isLoading: connectionLoading } = useRailwayConnection();
  
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);

  // Calculer les statistiques réelles
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    pendingTasks: tasks.filter(task => task.status === 'todo').length,
    totalDocuments: 0, // À implémenter
    attendanceRate: 95, // À calculer
    performanceRate: 87, // À calculer
    totalSalary: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0),
    pendingRequests: 0 // À implémenter
  };

  const taskStats = getTaskStats();

  const toggleSalaryVisibility = () => {
    setIsSalaryVisible(!isSalaryVisible);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' F CFA';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  // Données réelles pour les activités récentes
  const recentActivities = tasks.slice(0, 3).map(task => ({
    id: task.id,
    type: 'task',
    title: task.title,
    description: task.assigned_employee ? 
      `Tâche ${task.status === 'completed' ? 'terminée' : 'en cours'} par ${task.assigned_employee.first_name} ${task.assigned_employee.last_name}` :
      'Tâche non assignée',
    status: task.status,
    date: task.created_at ? new Date(task.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'N/A'
  }));

  const recentTasks = tasks.slice(0, 3).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || 'Pas de description',
    status: task.status,
    assignedTo: task.assigned_employee ? 
      `${task.assigned_employee.first_name} ${task.assigned_employee.last_name}` :
      'Non assigné'
  }));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord
        </h1>
        <p className="text-gray-600">
          Bienvenue {user?.first_name || user?.email} ! 
          {hasRole('admin') && ' - Vue Administrateur'}
          {!isConnected && ' - Connexion Railway en cours...'}
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Employés Actifs"
          value={stats.activeEmployees}
          trend={{
            value: 5,
            isPositive: true
          }}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        
        <StatCard
          title="Tâches Terminées"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          trend={{
            value: 12,
            isPositive: true
          }}
          icon={<CheckSquare className="h-6 w-6" />}
          color="green"
        />
        
        <StatCard
          title="Taux de Présence"
          value={`${stats.attendanceRate}%`}
          trend={{
            value: 2,
            isPositive: true
          }}
          icon={<UserCheck className="h-6 w-6" />}
          color="purple"
        />
        
        <StatCard
          title="Performance"
          value={`${stats.performanceRate}%`}
          trend={{
            value: 8,
            isPositive: true
          }}
          icon={<TrendingUp className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Contrôle de visibilité des salaires (Admin) */}
      {hasRole('admin') && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Contrôles Administrateur
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSalaryVisibility}
                className="flex items-center gap-2"
              >
                {isSalaryVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isSalaryVisible ? 'Masquer Salaires' : 'Afficher Salaires'}
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Actions rapides et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/employees" className="w-full">
              <Button className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gérer les Employés
              </Button>
            </Link>
            <Link to="/tasks" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="h-4 w-4 mr-2" />
                Gérer les Tâches
              </Button>
            </Link>
            <Link to="/documents" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <File className="h-4 w-4 mr-2" />
                Gérer les Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusLabel(activity.status)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tâches Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.assignedTo}</p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune tâche récente</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};