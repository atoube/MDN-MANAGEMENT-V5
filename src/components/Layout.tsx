import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Home, BarChart3, Users, FileText, Calendar, Settings, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de Bord', href: '/dashboard', icon: BarChart3 },
    { name: 'Accueil', href: '/home', icon: Home },
    { name: 'Employés', href: '/employees', icon: Users },
    { name: 'Projets', href: '/projects', icon: FileText },
    { name: 'Absences', href: '/absences', icon: Calendar },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">MADON</h1>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.location.href = '/login'}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
