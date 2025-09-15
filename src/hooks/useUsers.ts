import { useState, useEffect } from 'react';
import { useRailwayConnection } from './useRailwayConnection';

export interface User {
  id: number;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'manager' | 'hr';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery, isConnected } = useRailwayConnection();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await executeQuery('users');
      setUsers(data.users || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      console.error('Erreur fetchUsers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser.user]);
        return newUser.user;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => 
          prev.map(user => user.id === id ? updatedUser.user : user)
        );
        
        // Mettre à jour l'utilisateur actuel si c'est lui
        if (currentUser && currentUser.id === id) {
          setCurrentUser(updatedUser.user);
        }
        
        return updatedUser.user;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'utilisateur';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== id));
        return true;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  const getUsersByRole = (role: User['role']) => {
    return users.filter(user => user.role === role);
  };

  const getAdmins = () => {
    return users.filter(user => user.role === 'admin');
  };

  const getManagers = () => {
    return users.filter(user => user.role === 'manager');
  };

  const getRegularUsers = () => {
    return users.filter(user => user.role === 'user');
  };

  const getUserStats = () => {
    const total = users.length;
    const admins = getAdmins().length;
    const managers = getManagers().length;
    const regularUsers = getRegularUsers().length;

    return {
      total,
      admins,
      managers,
      regularUsers
    };
  };

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur sauvegardé:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchUsers();
    }
  }, [isConnected]);

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout,
    getUserById,
    getUsersByRole,
    getAdmins,
    getManagers,
    getRegularUsers,
    getUserStats
  };
};
