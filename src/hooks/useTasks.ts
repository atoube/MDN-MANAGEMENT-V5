import { useState, useEffect } from 'react';
import { useRailwayConnection } from './useRailwayConnection';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: number;
  created_by?: number;
  due_date?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  assigned_employee?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_by_employee?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery, isConnected } = useRailwayConnection();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tâches');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des tâches';
      setError(errorMessage);
      console.error('Erreur fetchTasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la tâche');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la tâche');
      }

      const updatedTask = await response.json();
      setTasks(prev => 
        prev.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la tâche');
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la tâche';
      setError(errorMessage);
      throw err;
    }
  };

  const getTaskById = (id: number) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getTasksByEmployee = (employeeId: number) => {
    return tasks.filter(task => task.assigned_to === employeeId);
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      return new Date(task.due_date) < today;
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const pending = tasks.filter(task => task.status === 'todo').length;
    const overdue = getOverdueTasks().length;

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByEmployee,
    getOverdueTasks,
    getTaskStats
  };
};
