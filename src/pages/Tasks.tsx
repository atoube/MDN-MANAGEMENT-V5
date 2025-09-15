import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
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
  RefreshCw,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks, Task } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';
import { toast } from 'sonner';

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, getTaskStats } = useTasks();
  const { employees } = useEmployees();
  
  const [view, setView] = useState<'kanban' | 'list' | 'metrics'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  // Colonnes Kanban
  const columns = [
    { id: 'todo', name: 'À faire', color: 'bg-gray-100', textColor: 'text-gray-700' },
    { id: 'in_progress', name: 'En cours', color: 'bg-blue-100', textColor: 'text-blue-700' },
    { id: 'completed', name: 'Terminé', color: 'bg-green-100', textColor: 'text-green-700' },
    { id: 'cancelled', name: 'Annulé', color: 'bg-red-100', textColor: 'text-red-700' }
  ];

  // Tâches filtrées
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (filterAssignee !== 'all') {
      filtered = filtered.filter(task => task.assigned_to === parseInt(filterAssignee));
    }

    return filtered;
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee]);

  // Tâches groupées par statut pour Kanban
  const tasksByStatus = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};
    columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.status === column.id);
    });
    return grouped;
  }, [filteredTasks]);

  // Statistiques
  const stats = getTaskStats();

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    try {
      const result = await createTask({
        ...taskData,
        created_by: user?.id || 1,
        status: 'todo'
      });
      console.log('Task creation successful:', result);
      setIsTaskModalOpen(false);
      toast.success('Tâche créée avec succès');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  const handleUpdateTask = async (id: number, data: Partial<Task>) => {
    try {
      const result = await updateTask(id, data);
      console.log('Task update successful:', result);
      toast.success('Tâche mise à jour avec succès');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    try {
      const result = await deleteTask(id);
      console.log('Task deletion successful:', result);
      toast.success('Tâche supprimée avec succès');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erreur lors de la suppression de la tâche');
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== newStatus) {
      await handleUpdateTask(taskId, { status: newStatus as Task['status'] });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssigneeName = (assignedTo?: number) => {
    if (!assignedTo) return 'Non assigné';
    const employee = employees.find(emp => emp.id === assignedTo);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Utilisateur inconnu';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Target className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tâches</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion des tâches et suivi des projets
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchTasks}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={() => setIsTaskModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Tâche
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">À faire</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Timer className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">En cours</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Terminées</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Taux</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Toutes les priorités</option>
                <option value="high">Haute</option>
                <option value="medium">Moyenne</option>
                <option value="low">Basse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
              >
                <option value="all">Tous les assignés</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Onglets */}
      <Tabs value={view} onValueChange={(value) => setView(value as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center">
            <Kanban className="h-4 w-4 mr-2" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Métriques
          </TabsTrigger>
        </TabsList>

        {/* Vue Kanban */}
        <TabsContent value="kanban" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.id} className="space-y-4">
                <div className={`p-4 rounded-lg ${column.color}`}>
                  <h3 className={`font-semibold ${column.textColor}`}>
                    {column.name} ({tasksByStatus[column.id]?.length || 0})
                  </h3>
                </div>
                
                <div 
                  className="min-h-[400px] space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {tasksByStatus[column.id]?.map(task => (
                    <Card 
                      key={task.id} 
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(task.priority || 'medium')}>
                              {task.priority || 'medium'}
                            </Badge>
                            {task.due_date && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(task.due_date).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            {getAssigneeName(task.assigned_to)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Vue Liste */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <div className="space-y-4 p-6">
              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        {task.description} • {task.status} • {task.priority}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Assigné à: {getAssigneeName(task.assigned_to)}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-gray-400">
                            Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority || 'medium')}>
                      {task.priority || 'medium'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsTaskModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>Aucune tâche trouvée</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Vue Métriques */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {columns.map(column => {
                    const count = tasksByStatus[column.id]?.length || 0;
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={column.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{column.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${column.color.replace('bg-', 'bg-').replace('-100', '-500')}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Priorité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['high', 'medium', 'low'].map(priority => {
                    const count = tasks.filter(task => task.priority === priority).length;
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{priority}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getPriorityColor(priority).replace('bg-', 'bg-').replace('-100', '-500')}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal pour nouvelle tâche */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedTask ? 'Modifier la tâche' : 'Nouvelle Tâche'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsTaskModalOpen(false);
                  setSelectedTask(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newTask = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                priority: formData.get('priority') as 'low' | 'medium' | 'high',
                assigned_to: formData.get('assigned_to') ? parseInt(formData.get('assigned_to') as string) : undefined,
                due_date: formData.get('due_date') as string,
                status: selectedTask?.status || 'todo' as const,
              };
              
              if (selectedTask) {
                handleUpdateTask(selectedTask.id, newTask);
              } else {
                handleCreateTask(newTask);
              }
            }}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titre de la tâche"
                    defaultValue={selectedTask?.title || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description de la tâche"
                    rows={3}
                    defaultValue={selectedTask?.description || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                    <select 
                      name="priority"
                      defaultValue={selectedTask?.priority || 'medium'}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
                    <select 
                      name="assigned_to"
                      defaultValue={selectedTask?.assigned_to || ''}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Non assigné</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    name="due_date"
                    defaultValue={selectedTask?.due_date ? selectedTask.due_date.split('T')[0] : ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setSelectedTask(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  {selectedTask ? 'Mettre à jour' : 'Créer la tâche'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}