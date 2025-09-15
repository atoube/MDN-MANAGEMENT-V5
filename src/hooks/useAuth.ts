import { useState, useEffect, createContext, useContext } from 'react';
import { useUsers, User } from './useUsers';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login: loginUser, logout: logoutUser, updateUser, currentUser } = useUsers();

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('Aucun utilisateur connecté');
    }

    try {
      const updatedUser = await updateUser(user.id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const hasRole = (role: User['role']): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: User['role'][]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  // Synchroniser avec le hook useUsers
  useEffect(() => {
    setUser(currentUser);
    setIsLoading(false);
  }, [currentUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    hasRole,
    hasAnyRole
  };
};
