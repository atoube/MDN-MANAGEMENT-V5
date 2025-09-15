import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
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
import { useAuth } from '../contexts/AuthContext';
import { useEmployees, Employee } from '../hooks/useEmployees';
import { UserAvatar } from '../components/profile/AvatarSelector';
import { toast } from 'sonner';

export default function Employees() {
  const { user } = useAuth();
  const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isNewEmployeeDialogOpen, setIsNewEmployeeDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSalaryVisible, setIsSalaryVisible] = useState(false);
  const [editableFields, setEditableFields] = useState({
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  // Vérifier les permissions pour accéder à la page des employés
  const hasAccess = useMemo(() => {
    if (!user) return false;
    
    return (
      user.role === 'admin' ||
      user.role === 'hr' ||
      user.email === 'admin@madon.com' ||
      user.email === 'hr@madon.com' ||
      user.email === 'admin@example.com' ||
      process.env.NODE_ENV === 'development' ||
      user.role === 'user'
    );
  }, [user]);

  // Récupérer les informations employé de l'utilisateur connecté
  const currentEmployee = useMemo(() => {
    if (!user || !employees) return null;
    
    const employee = employees.find(emp => emp.email === user.email);
    return employee;
  }, [user, employees]);

  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    let employeesToShow = employees;
    
    // Si l'utilisateur n'est pas admin ou RH, ne montrer que son propre profil
    if (user?.role !== 'admin' && user?.role !== 'hr') {
      employeesToShow = employees.filter(emp => emp.email === user?.email);
    }
    
    return employeesToShow.filter(employee => {
      const matchesSearch = 
        searchTerm === '' || 
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.phone || '').includes(searchTerm);
      
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter, user]);

  const departments = useMemo(() => {
    if (!employees) return [];
    
    let employeesToShow = employees;
    
    if (user?.role !== 'admin' && user?.role !== 'hr') {
      employeesToShow = employees.filter(emp => emp.email === user?.email);
    }
    
    return [...new Set(employeesToShow.map(emp => emp.department))].sort();
  }, [employees, user]);

  const stats = useMemo(() => {
    if (!employees) return { total: 0, active: 0, inactive: 0, totalSalary: 0 };
    
    let employeesToCount = employees;
    
    if (user?.role !== 'admin' && user?.role !== 'hr') {
      employeesToCount = employees.filter(emp => emp.email === user?.email);
    }
    
    const total = employeesToCount.length;
    const active = employeesToCount.filter(emp => emp.status === 'active').length;
    const inactive = employeesToCount.filter(emp => emp.status === 'inactive').length;
    const totalSalary = employeesToCount.reduce((sum, emp) => {
      const salary = emp.salary || 0;
      return sum + salary;
    }, 0);

    return { total, active, inactive, totalSalary };
  }, [employees, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'on_leave':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleCreateEmployee = async (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const result = await createEmployee(data);
      console.log('Employee creation successful:', result);
      setIsNewEmployeeDialogOpen(false);
      toast.success('Employé créé avec succès');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Erreur lors de la création de l\'employé');
    }
  };

  const handleUpdateEmployee = async (id: number, data: Partial<Employee>) => {
    try {
      const result = await updateEmployee(id, data);
      console.log('Employee update successful:', result);
      
      setIsEmployeeDialogOpen(false);
      setSelectedEmployee(null);
      toast.success('Employé mis à jour avec succès');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour de l\'employé');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;
    
    try {
      const result = await deleteEmployee(id);
      console.log('Employee deletion successful:', result);
      toast.success('Employé supprimé avec succès');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Erreur lors de la suppression de l\'employé');
    }
  };

  // Fonctions pour l'édition du profil
  const handleEditProfile = () => {
    if (currentEmployee) {
      setEditableFields({
        phone: currentEmployee.phone || '',
        address: currentEmployee.address || '',
        emergency_contact: currentEmployee.emergency_contact || '',
        emergency_phone: currentEmployee.emergency_phone || ''
      });
    }
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!currentEmployee) return;
    
    try {
      await updateEmployee(currentEmployee.id, {
        phone: editableFields.phone,
        address: editableFields.address,
        emergency_contact: editableFields.emergency_contact,
        emergency_phone: editableFields.emergency_phone
      });
      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSalaryVisibility = () => {
    setIsSalaryVisible(!isSalaryVisible);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-500">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

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
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Gestion des Employés' : 'Mon Profil Employé'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'admin' 
              ? 'Gérez vos employés et leurs informations' 
              : 'Consultez vos informations et vos demandes de congés'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleSalaryVisibility}
            className="flex items-center gap-2"
          >
            {isSalaryVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {isSalaryVisible ? 'Masquer Salaires' : 'Afficher Salaires'}
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchEmployees}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {user?.role === 'admin' && (
            <Button onClick={() => setIsNewEmployeeDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel Employé
            </Button>
          )}
        </div>
      </div>

      {/* Profil de l'employé connecté (si non-admin) */}
      {user?.role !== 'admin' && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <UserAvatar
                    name={currentEmployee ? `${currentEmployee.first_name} ${currentEmployee.last_name}` : undefined}
                    size="lg"
                    className="border-2 border-gray-200"
                    photoUrl={currentEmployee?.photo_url || undefined}
                  />
                </div>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Mon Profil
                </CardTitle>
              </div>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentEmployee ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nom complet</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentEmployee.first_name} {currentEmployee.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg text-gray-900">{currentEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Département</p>
                  <p className="text-lg text-gray-900">{currentEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fonction</p>
                  <p className="text-lg text-gray-900">{currentEmployee.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  {isEditingProfile ? (
                    <Input
                      value={editableFields.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="Numéro de téléphone"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{currentEmployee.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date d'embauche</p>
                  <p className="text-lg text-gray-900">
                    {currentEmployee.hire_date ? new Date(currentEmployee.hire_date).toLocaleDateString('fr-FR') : 'Non renseignée'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <Badge className={
                    currentEmployee.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : currentEmployee.status === 'inactive'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }>
                    {currentEmployee.status === 'active' ? 'Actif' : 
                     currentEmployee.status === 'inactive' ? 'Inactif' : 'En congé'}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-500">Salaire</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSalaryVisibility}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      {isSalaryVisible ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-lg text-gray-900">
                    {isSalaryVisible ? `${currentEmployee.salary || 0} F CFA` : '•••••• F CFA'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  {isEditingProfile ? (
                    <Input
                      value={editableFields.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      placeholder="Adresse complète"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{currentEmployee.address || 'Non renseignée'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact d'urgence</p>
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <Input
                        value={editableFields.emergency_contact}
                        onChange={(e) => handleFieldChange('emergency_contact', e.target.value)}
                        placeholder="Nom du contact d'urgence"
                        className="mt-1"
                      />
                      <Input
                        value={editableFields.emergency_phone}
                        onChange={(e) => handleFieldChange('emergency_phone', e.target.value)}
                        placeholder="Téléphone du contact d'urgence"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg text-gray-900">{currentEmployee.emergency_contact || 'Non renseigné'}</p>
                      {currentEmployee.emergency_phone && (
                        <p className="text-sm text-gray-600">{currentEmployee.emergency_phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Profil employé non trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Votre profil employé n'a pas été trouvé. Contactez l'administrateur.
                </p>
                <p className="text-sm text-gray-500">
                  Email connecté: {user?.email}
                </p>
              </div>
            )}
            
            {/* Boutons d'édition */}
            {isEditingProfile && (
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex-1 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Employés</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Employés Actifs</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Employés Inactifs</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Masse Salariale</h3>
              <p className="text-3xl font-semibold text-gray-900">
                {isSalaryVisible ? formatPrice(stats.totalSalary) : '•••••• F CFA'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des employés */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 p-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10"
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
              options={[
                { value: 'all', label: 'Tous les départements' },
                ...departments.map(dept => ({ value: dept || '', label: dept || '' }))
              ]}
              className="w-48"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' }
              ]}
              className="w-40"
            />
          </div>
        </div>

        {/* Tableau des employés */}
        <Table
          headers={[
            'Employé',
            'Contact',
            'Département',
            'Poste',
            'Salaire',
            'Statut'
          ]}
        >
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr 
                key={employee.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setIsEmployeeDialogOpen(true);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserAvatar
                        name={`${employee.first_name} ${employee.last_name}`}
                        size="md"
                        photoUrl={employee.photo_url || undefined}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">ID: {employee.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {employee.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {employee.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {isSalaryVisible ? formatPrice(employee.salary || 0) : '•••••• F CFA'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(employee.status || 'active') as any}>
                    {employee.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Aucun employé trouvé</p>
          </div>
        )}
      </Card>

      {/* Modal pour voir/modifier un employé */}
      {isEmployeeDialogOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Détails de l'employé : {selectedEmployee.first_name} {selectedEmployee.last_name}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEmployeeDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedEmployee = {
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                department: formData.get('department') as string,
                position: formData.get('position') as string,
                salary: parseInt(formData.get('salary') as string) || 0,
                status: formData.get('status') as 'active' | 'inactive',
                address: formData.get('address') as string,
                emergency_contact: formData.get('emergency_contact') as string,
                emergency_phone: formData.get('emergency_phone') as string,
              };
              
              handleUpdateEmployee(selectedEmployee.id, updatedEmployee);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    name="first_name"
                    defaultValue={selectedEmployee.first_name}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    name="last_name"
                    defaultValue={selectedEmployee.last_name}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedEmployee.email}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedEmployee.phone}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={selectedEmployee.department}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
                  <input
                    type="text"
                    name="position"
                    defaultValue={selectedEmployee.position}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire (F.CFA) *</label>
                  <input
                    type="number"
                    name="salary"
                    defaultValue={selectedEmployee.salary}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                  <select
                    name="status"
                    defaultValue={selectedEmployee.status}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={selectedEmployee.address}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence</label>
                  <input
                    type="text"
                    name="emergency_contact"
                    defaultValue={selectedEmployee.emergency_contact}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
                  <input
                    type="tel"
                    name="emergency_phone"
                    defaultValue={selectedEmployee.emergency_phone}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="destructive" 
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
                      handleDeleteEmployee(selectedEmployee.id);
                      setIsEmployeeDialogOpen(false);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer l'employé
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant="secondary" 
                    onClick={() => setIsEmployeeDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour nouveau employé */}
      {isNewEmployeeDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouvel Employé</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsNewEmployeeDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newEmployee = {
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                department: formData.get('department') as string,
                position: formData.get('position') as string,
                salary: parseInt(formData.get('salary') as string) || 0,
                hire_date: formData.get('hire_date') as string,
                role: 'employee',
                status: 'active' as const,
                address: formData.get('address') as string || '',
                emergency_contact: formData.get('emergency_contact') as string || '',
                emergency_phone: formData.get('emergency_phone') as string || '',
              };
              
              handleCreateEmployee(newEmployee);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Prénom"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Nom"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@madon.cm"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+237 6 XX XX XX XX"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                  <select 
                    name="department"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Sélectionner un département</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                    <option value="Ventes">Ventes</option>
                    <option value="Logistique">Logistique</option>
                    <option value="Support">Support</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Poste"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salaire (F.CFA) *</label>
                  <input
                    type="number"
                    name="salary"
                    placeholder="300000"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche *</label>
                  <input
                    type="date"
                    name="hire_date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse complète"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence</label>
                  <input
                    type="text"
                    name="emergency_contact"
                    placeholder="Nom du contact d'urgence"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
                  <input
                    type="tel"
                    name="emergency_phone"
                    placeholder="+237 6 XX XX XX XX"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setIsNewEmployeeDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer l'employé
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}