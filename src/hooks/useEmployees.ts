import { useState, useEffect } from 'react';
import { useRailwayConnection } from './useRailwayConnection';

export interface Employee {
  id: number;
  user_id?: number;
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  hire_date?: string;
  salary?: number;
  status?: 'active' | 'inactive' | 'terminated';
  avatar_url?: string;
  photo_url?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery, isConnected } = useRailwayConnection();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord l'API, sinon utiliser les données mockées
      try {
        const data = await executeQuery('employees');
        setEmployees(Array.isArray(data) ? data : (data.employees || []));
      } catch (apiError) {
        // Si l'API échoue, utiliser les données mockées
        console.warn('API non disponible, utilisation des données mockées');
        const mockData = [
          {
            id: 1,
            first_name: 'Jean',
            last_name: 'Dupont',
            email: 'jean.dupont@madon.com',
            phone: '+33 1 23 45 67 89',
            position: 'Développeur Senior',
            department: 'IT',
            hire_date: '2022-01-15',
            salary: 55000,
            status: 'active' as const,
            created_at: '2022-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: 2,
            first_name: 'Marie',
            last_name: 'Martin',
            email: 'marie.martin@madon.com',
            phone: '+33 1 23 45 67 90',
            position: 'Chef de Projet',
            department: 'Management',
            hire_date: '2021-03-20',
            salary: 65000,
            status: 'active' as const,
            created_at: '2021-03-20T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: 3,
            first_name: 'Pierre',
            last_name: 'Durand',
            email: 'pierre.durand@madon.com',
            phone: '+33 1 23 45 67 91',
            position: 'Designer UX/UI',
            department: 'Design',
            hire_date: '2023-06-10',
            salary: 48000,
            status: 'active' as const,
            created_at: '2023-06-10T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          }
        ];
        setEmployees(mockData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des employés';
      setError(errorMessage);
      console.error('Erreur fetchEmployees:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees(prev => [...prev, newEmployee.employee]);
        return newEmployee.employee;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'employé';
      setError(errorMessage);
      throw err;
    }
  };

  const updateEmployee = async (id: number, employeeData: Partial<Employee>) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees(prev => 
          prev.map(emp => emp.id === id ? updatedEmployee.employee : emp)
        );
        return updatedEmployee.employee;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'employé';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        return true;
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'employé';
      setError(errorMessage);
      throw err;
    }
  };

  const getEmployeeById = (id: number) => {
    return employees.find(emp => emp.id === id);
  };

  const getEmployeesByDepartment = (department: string) => {
    return employees.filter(emp => emp.department === department);
  };

  const getActiveEmployees = () => {
    return employees.filter(emp => emp.status === 'active');
  };

  useEffect(() => {
    if (isConnected) {
      fetchEmployees();
    }
  }, [isConnected]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeesByDepartment,
    getActiveEmployees
  };
};
