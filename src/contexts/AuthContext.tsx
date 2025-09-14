import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePasswordManager } from '../hooks/usePasswordManager';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  first_name?: string;
  last_name?: string;
  department?: string;
  position?: string;
  must_change_password?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { verifyPassword, getPasswordData } = usePasswordManager();

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Ne pas créer d'utilisateur par défaut - laisser l'utilisateur se connecter manuellement
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; mustChangePassword?: boolean; error?: string }> => {
    try {
      // Essayer d'abord l'API
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          return { 
            success: true, 
            mustChangePassword: userData.must_change_password 
          };
        } else {
          console.log('API retourne une erreur, utilisation du mode développement');
        }
      } catch {
        console.log('API non disponible, utilisation du mode développement');
      }

      // Vérifier le mot de passe avec notre système de gestion
      const isPasswordValid = verifyPassword(email, password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Mot de passe incorrect' };
      }

      // Vérifier si c'est l'admin système (compte spécial)
      if (email.toLowerCase() === 'admin@madon.cm') {
        const adminUser: User = {
          id: '0',
          email: 'admin@madon.cm',
          name: 'Administrateur Système',
          role: 'admin',
          first_name: 'Administrateur',
          last_name: 'Système',
          department: 'IT',
          position: 'Administrateur Système',
          must_change_password: false
        };
        
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true, mustChangePassword: false };
      }

      // Pour le développement, récupérer les informations employé depuis localStorage
      try {
        const savedEmployees = localStorage.getItem('employees');
        console.log('🔍 AuthContext - savedEmployees:', savedEmployees ? 'Présent' : 'Absent');
        
        if (savedEmployees) {
          const employees = JSON.parse(savedEmployees);
          console.log('👥 AuthContext - Nombre d\'employés:', employees.length);
          console.log('📧 AuthContext - Emails disponibles:', employees.map((emp: { email: string }) => emp.email));
          
          const employee = employees.find((emp: { email: string }) => emp.email === email);
          console.log('🔍 AuthContext - Employé trouvé pour', email, ':', employee ? 'Oui' : 'Non');
          
          if (employee) {
            // Vérifier le statut de l'employé
            if (employee.status === 'inactive') {
              return { 
                success: false, 
                error: 'Votre compte a été désactivé. Veuillez contacter l\'administrateur pour plus d\'informations.' 
              };
            }

            // Récupérer les données de mot de passe persistées
            const passwordData = getPasswordData(email);
            const mustChangePassword = passwordData ? passwordData.mustChangePassword : (employee.must_change_password || true);

            const userData: User = {
              id: employee.id.toString(),
              email: employee.email,
              name: `${employee.first_name} ${employee.last_name}`,
              role: employee.role,
              first_name: employee.first_name,
              last_name: employee.last_name,
              department: employee.department,
              position: employee.position,
              must_change_password: mustChangePassword
            };

            localStorage.setItem('currentUser', JSON.stringify(userData));
            setUser(userData);
            return { success: true, mustChangePassword: mustChangePassword };
          }
        } else {
          console.log('Aucune donnée d\'employés trouvée dans localStorage');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données employé:', error);
      }

      // Si l'employé n'est pas trouvé, refuser la connexion
      return { 
        success: false, 
        error: 'Aucun compte trouvé avec cette adresse email. Veuillez contacter l\'administrateur.' 
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Une erreur est survenue lors de la connexion' };
    }
  };

  const logout = () => {
    // Nettoyer toutes les données utilisateur
    localStorage.removeItem('currentUser');
    
    // Nettoyer la photo de profil si elle existe
    if (user?.email) {
      localStorage.removeItem(`profile_photo_${user.email}`);
    }
    
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};