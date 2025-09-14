import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus
} from 'lucide-react';

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Données d'exemple pour la démonstration
  const employees = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@madon.com',
      position: 'Développeur Senior',
      department: 'IT',
      phone: '+33 1 23 45 67 89',
      location: 'Paris, France',
      hireDate: '2022-01-15',
      status: 'Actif',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@madon.com',
      position: 'Chef de Projet',
      department: 'Management',
      phone: '+33 1 23 45 67 90',
      location: 'Lyon, France',
      hireDate: '2021-03-20',
      status: 'Actif',
      avatar: 'MM'
    },
    {
      id: 3,
      name: 'Pierre Durand',
      email: 'pierre.durand@madon.com',
      position: 'Designer UX/UI',
      department: 'Design',
      phone: '+33 1 23 45 67 91',
      location: 'Marseille, France',
      hireDate: '2023-06-10',
      status: 'Actif',
      avatar: 'PD'
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@madon.com',
      position: 'Responsable RH',
      department: 'RH',
      phone: '+33 1 23 45 67 92',
      location: 'Toulouse, France',
      hireDate: '2020-09-05',
      status: 'Actif',
      avatar: 'SL'
    }
  ];

  const departments = ['all', 'IT', 'Management', 'Design', 'RH'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Employés</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos employés et leurs informations
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Employés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {employees.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Employés Actifs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {employees.filter(e => e.status === 'Actif').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Départements
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {departments.length - 1}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Nouveaux ce mois
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    2
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">Tous les départements</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredEmployees.map((employee) => (
            <li key={employee.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {employee.avatar}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">{employee.position}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Mail className="h-3 w-3 mr-1" />
                        {employee.email}
                        <Phone className="h-3 w-3 ml-3 mr-1" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {employee.location}
                        <Calendar className="h-3 w-3 ml-3 mr-1" />
                        Embauché le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {employee.department}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default Employees;
