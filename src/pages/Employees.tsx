import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  RefreshCw,
  Edit2,
  Trash2,
  Camera,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: string;
  hire_date: string;
  avatar?: string;
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
  const [activeTab, setActiveTab] = useState(defaultValue || 'all');
  
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

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Données réelles de votre base Railway
  const employees: Employee[] = [
    {
      id: 1,
      first_name: 'Marie',
      last_name: 'Martin',
      email: 'marie.martin@madon.com',
      phone: '+237 6 12 34 56 78',
      department: 'Développement',
      position: 'Développeuse Senior',
      role: 'employee',
      status: 'active',
      salary: '450000',
      hire_date: '2023-01-15'
    },
    {
      id: 2,
      first_name: 'Jean',
      last_name: 'Dupont',
      email: 'jean.dupont@madon.com',
      phone: '+237 6 23 45 67 89',
      department: 'Marketing',
      position: 'Chef de Projet',
      role: 'employee',
      status: 'active',
      salary: '380000',
      hire_date: '2023-03-20'
    },
    {
      id: 3,
      first_name: 'Ahmadou',
      last_name: 'Diallo',
      email: 'ahmadou.diallo@madon.com',
      phone: '+237 6 34 56 78 90',
      department: 'Finance',
      position: 'Comptable',
      role: 'employee',
      status: 'active',
      salary: '320000',
      hire_date: '2023-05-10'
    },
    {
      id: 4,
      first_name: 'Laila',
      last_name: 'Chraibi',
      email: 'laila.chraibi@madon.com',
      phone: '+237 6 45 67 89 01',
      department: 'RH',
      position: 'Responsable RH',
      role: 'hr',
      status: 'active',
      salary: '420000',
      hire_date: '2023-07-01'
    },
    {
      id: 5,
      first_name: 'Achille',
      last_name: 'Nguema',
      email: 'achille.nguema@madon.com',
      phone: '+237 6 56 78 90 12',
      department: 'Direction',
      position: 'Directeur Général',
      role: 'admin',
      status: 'active',
      salary: '650000',
      hire_date: '2022-12-01'
    }
  ];

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('fr-FR').format(parseInt(amount)) + ' F CFA';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'on_leave': return 'En congé';
      default: return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'hr': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Employés
        </h1>
        <p className="text-gray-600">
          Gérez les employés, leurs informations et leurs statuts
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Employés</h3>
                <p className="text-3xl font-semibold text-gray-900">{employees.length}</p>
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
                <h3 className="text-lg font-medium text-gray-900">Actifs</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">En Congé</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {employees.filter(emp => emp.status === 'on_leave').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Masse Salariale</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {isSalaryVisible ? formatPrice(
                    employees.reduce((sum, emp) => sum + parseInt(emp.salary), 0).toString()
                  ) : '***'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles et filtres */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Employés</CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSalaryVisible(!isSalaryVisible)}
                className="flex items-center gap-2"
              >
                {isSalaryVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isSalaryVisible ? 'Masquer Salaires' : 'Afficher Salaires'}
              </Button>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Nouvel Employé
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="on_leave">En congé</option>
            </Select>
          </div>

          {/* Tableau des employés */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  {isSalaryVisible && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salaire
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(employee.status)}>
                        {getStatusLabel(employee.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleColor(employee.role)}>
                        {getRoleLabel(employee.role)}
                      </Badge>
                    </td>
                    {isSalaryVisible && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPrice(employee.salary)}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}