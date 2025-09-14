import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Folder,
  Calendar,
  User
} from 'lucide-react';

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Données d'exemple pour la démonstration
  const documents = [
    {
      id: 1,
      name: 'Contrat de travail - Jean Dupont.pdf',
      type: 'Contrat',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'Sophie Laurent',
      status: 'Approuvé',
      category: 'RH'
    },
    {
      id: 2,
      name: 'Présentation Q1 2024.pptx',
      type: 'Présentation',
      size: '5.8 MB',
      uploadDate: '2024-01-10',
      uploadedBy: 'Marie Martin',
      status: 'En révision',
      category: 'Management'
    },
    {
      id: 3,
      name: 'Spécifications techniques.docx',
      type: 'Document',
      size: '1.2 MB',
      uploadDate: '2024-01-08',
      uploadedBy: 'Jean Dupont',
      status: 'Brouillon',
      category: 'IT'
    },
    {
      id: 4,
      name: 'Rapport financier 2023.xlsx',
      type: 'Tableur',
      size: '3.1 MB',
      uploadDate: '2024-01-05',
      uploadedBy: 'Pierre Durand',
      status: 'Finalisé',
      category: 'Finance'
    },
    {
      id: 5,
      name: 'Guide utilisateur.pdf',
      type: 'Manuel',
      size: '4.7 MB',
      uploadDate: '2024-01-03',
      uploadedBy: 'Sophie Laurent',
      status: 'Publié',
      category: 'Documentation'
    }
  ];

  const documentTypes = ['all', 'Contrat', 'Présentation', 'Document', 'Tableur', 'Manuel'];
  const categories = ['all', 'RH', 'Management', 'IT', 'Finance', 'Documentation'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
      case 'Finalisé':
      case 'Publié':
        return 'bg-green-100 text-green-800';
      case 'En révision':
        return 'bg-yellow-100 text-yellow-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Contrat':
      case 'Document':
      case 'Manuel':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'Présentation':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'Tableur':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et organisez vos documents d'entreprise
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Documents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {documents.length}
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
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Documents Finalisés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {documents.filter(d => d.status === 'Finalisé' || d.status === 'Publié').length}
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
                <FileText className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En Révision
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {documents.filter(d => d.status === 'En révision').length}
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
                <Folder className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Catégories
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {categories.length - 1}
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
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {documentTypes.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => (
            <li key={document.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {document.name}
                      </p>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(document.status)}`}>
                        {document.status}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="mr-4">{document.size}</span>
                        <span className="mr-4">{document.type}</span>
                        <span className="mr-4">{document.category}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        {document.uploadedBy}
                        <Calendar className="h-3 w-3 ml-3 mr-1" />
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-blue-600" title="Voir">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-green-600" title="Télécharger">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" title="Modifier">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;
