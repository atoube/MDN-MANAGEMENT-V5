import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  FolderOpen, 
  FileText, 
  BookOpen,
  Search,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Share,
  Star,
  Calendar,
  User,
  Tag
} from 'lucide-react';

interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  description?: string;
  tags?: string[];
  isStarred?: boolean;
}

interface Space {
  id: number;
  name: string;
  description: string;
  documentCount: number;
  color: string;
}

interface Folder {
  id: number;
  name: string;
  spaceId: number;
  documentCount: number;
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

const Tabs: React.FC<{ children: React.ReactNode; defaultValue?: string }> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || 'spaces');
  
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

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  // Données d'exemple pour les espaces
  const spaces: Space[] = [
    {
      id: 1,
      name: 'Documents RH',
      description: 'Contrats, fiches de paie, évaluations',
      documentCount: 15,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Projets',
      description: 'Documentation des projets en cours',
      documentCount: 8,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Finance',
      description: 'Rapports financiers et comptabilité',
      documentCount: 12,
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Marketing',
      description: 'Campagnes et supports marketing',
      documentCount: 6,
      color: 'bg-purple-500'
    }
  ];

  // Données d'exemple pour les dossiers
  const folders: Folder[] = [
    { id: 1, name: 'Contrats', spaceId: 1, documentCount: 5 },
    { id: 2, name: 'Fiches de Paie', spaceId: 1, documentCount: 10 },
    { id: 3, name: 'Évaluations', spaceId: 1, documentCount: 3 },
    { id: 4, name: 'Rapports Mensuels', spaceId: 2, documentCount: 4 },
    { id: 5, name: 'Présentations', spaceId: 2, documentCount: 4 }
  ];

  // Données d'exemple pour les documents
  const documents: Document[] = [
    {
      id: 1,
      title: 'Contrat Marie Martin.pdf',
      type: 'pdf',
      size: '2.3 MB',
      category: 'contract',
      uploadedBy: 'Laila Chraibi',
      uploadDate: '2024-01-15',
      description: 'Contrat de travail pour Marie Martin',
      tags: ['contrat', 'rh', 'développement'],
      isStarred: true
    },
    {
      id: 2,
      title: 'Rapport Q1 2024.xlsx',
      type: 'xlsx',
      size: '1.8 MB',
      category: 'report',
      uploadedBy: 'Ahmadou Diallo',
      uploadDate: '2024-01-20',
      description: 'Rapport financier du premier trimestre',
      tags: ['rapport', 'finance', 'q1'],
      isStarred: false
    },
    {
      id: 3,
      title: 'Présentation Projet Alpha.pptx',
      type: 'pptx',
      size: '5.2 MB',
      category: 'presentation',
      uploadedBy: 'Jean Dupont',
      uploadDate: '2024-01-25',
      description: 'Présentation du projet Alpha',
      tags: ['présentation', 'projet', 'alpha'],
      isStarred: true
    }
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpace = !selectedSpace || doc.category === selectedSpace.name.toLowerCase().replace(' ', '_');
      
      return matchesSearch && matchesSpace;
    });
  }, [searchTerm, selectedSpace]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx': return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xlsx': return <FileText className="h-8 w-8 text-green-500" />;
      case 'pptx': return <FileText className="h-8 w-8 text-orange-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'presentation': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contract': return 'Contrat';
      case 'report': return 'Rapport';
      case 'presentation': return 'Présentation';
      case 'financial': return 'Financier';
      default: return category;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Documents
        </h1>
        <p className="text-gray-600">
          Organisez et gérez vos documents par espaces et dossiers
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Espaces</h3>
                <p className="text-3xl font-semibold text-gray-900">{spaces.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Dossiers</h3>
                <p className="text-3xl font-semibold text-gray-900">{folders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                <p className="text-3xl font-semibold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Favoris</h3>
                <p className="text-3xl font-semibold text-gray-900">
                  {documents.filter(doc => doc.isStarred).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Télécharger
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spaces">
            <TabsList>
              <TabsTrigger value="spaces">Espaces</TabsTrigger>
              <TabsTrigger value="documents">Tous les Documents</TabsTrigger>
              <TabsTrigger value="recent">Récents</TabsTrigger>
              <TabsTrigger value="starred">Favoris</TabsTrigger>
            </TabsList>

            <TabsContent value="spaces">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <div
                    key={space.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedSpace(space)}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg ${space.color}`}>
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{space.name}</h3>
                        <p className="text-sm text-gray-500">{space.documentCount} documents</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{space.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Dernière modification: {new Date().toLocaleDateString('fr-FR')}
                      </span>
                      <Button variant="outline" size="sm">
                        Ouvrir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getFileIcon(document.type)}
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {document.title}
                          </h4>
                          <p className="text-xs text-gray-500">{document.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {document.isStarred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getCategoryColor(document.category)}>
                        {getCategoryLabel(document.category)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {document.uploadedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {document.tags && document.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {document.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Documents Récents</h3>
                <p className="text-gray-500">Aucun document récent pour le moment</p>
              </div>
            </TabsContent>

            <TabsContent value="starred">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.filter(doc => doc.isStarred).map((document) => (
                  <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getFileIcon(document.type)}
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {document.title}
                          </h4>
                          <p className="text-xs text-gray-500">{document.size}</p>
                        </div>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(document.category)}>
                        {getCategoryLabel(document.category)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}