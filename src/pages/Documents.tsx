import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Plus, 
  FolderOpen, 
  FileText, 
  BookOpen,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments, Document, Space, Folder } from '../hooks/useDocuments';
import { toast } from 'sonner';

export default function Documents() {
  const { user } = useAuth();
  const { documents, spaces, folders, loading, error, fetchDocuments, createDocument, updateDocument, deleteDocument } = useDocuments();
  
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isCreateDocumentOpen, setIsCreateDocumentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Documents filtrés par espace et dossier
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => doc.status !== 'deleted');
    
    if (selectedSpace) {
      // Pour l'instant, on filtre par catégorie car on n'a pas encore space_id dans la DB
      filtered = filtered.filter(doc => doc.category === selectedSpace.name);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [documents, selectedSpace, searchTerm]);

  // Statistiques
  const stats = useMemo(() => {
    const activeDocuments = documents.filter(doc => doc.status !== 'deleted');
    const totalDocuments = activeDocuments.length;
    const publishedDocuments = activeDocuments.filter(doc => doc.status === 'published').length;
    const draftDocuments = activeDocuments.filter(doc => doc.status === 'draft').length;
    const totalSpaces = spaces.length;
    const totalFolders = folders.length;

    return {
      totalDocuments,
      publishedDocuments,
      draftDocuments,
      totalSpaces,
      totalFolders
    };
  }, [documents, spaces, folders]);

  const handleCreateDocument = async (documentData: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const result = await createDocument({
        ...documentData,
        uploaded_by: user?.id || 1,
        status: 'draft'
      });
      console.log('Document creation successful:', result);
      setIsCreateDocumentOpen(false);
      toast.success('Document créé avec succès');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Erreur lors de la création du document');
    }
  };

  const handleUpdateDocument = async (id: number, data: Partial<Document>) => {
    try {
      const result = await updateDocument(id, data);
      console.log('Document update successful:', result);
      toast.success('Document mis à jour avec succès');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Erreur lors de la mise à jour du document');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      const result = await deleteDocument(id);
      console.log('Document deletion successful:', result);
      toast.success('Document supprimé avec succès');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };

  const handleSpaceSelect = (space: Space) => {
    setSelectedSpace(space);
    setSelectedFolder(null);
  };

  const clearSelection = () => {
    setSelectedSpace(null);
    setSelectedFolder(null);
  };

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
          <FileText className="mx-auto h-12 w-12 text-red-500 mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et collaboration sur la documentation de l'entreprise
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchDocuments}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setIsCreateDocumentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Document
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Publiés</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.publishedDocuments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Brouillons</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.draftDocuments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Espaces</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalSpaces}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dossiers</h3>
              <p className="text-3xl font-semibold text-gray-900">{stats.totalFolders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation et contenu */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Espaces et dossiers */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Espaces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={clearSelection}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tous les espaces
              </Button>
              
              {spaces.map((space) => (
                <Button
                  key={space.id}
                  variant={selectedSpace?.id === space.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleSpaceSelect(space)}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: space.color }}
                  />
                  {space.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {selectedSpace && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dossiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(null)}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Tous les dossiers
                </Button>
                
                {folders
                  .filter(folder => folder.space_id === selectedSpace.id)
                  .map((folder) => (
                    <Button
                      key={folder.id}
                      variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedFolder(folder)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {folder.name}
                    </Button>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="spaces">Espaces</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedSpace ? selectedSpace.name : 'Tous les documents'}
                    {selectedFolder && ` - ${selectedFolder.name}`}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredDocuments.length} document(s) trouvé(s)
                  </p>
                </div>
              </div>

              {/* Filtres et recherche */}
              <Card>
                <div className="mb-6 flex flex-col sm:flex-row gap-4 p-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Rechercher un document..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>

                {/* Liste des documents */}
                <div className="space-y-4 p-6">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-500">
                            {document.category} • {document.status} • {document.created_at ? new Date(document.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                          </p>
                          {document.description && (
                            <p className="text-sm text-gray-400 mt-1">{document.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateDocument(document.id, { status: 'published' })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteDocument(document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Aucun document trouvé</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="spaces" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <Card key={space.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSpaceSelect(space)}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: space.color }}
                        ></div>
                        <CardTitle className="text-lg">{space.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {space.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{documents.filter(doc => doc.category === space.name).length} documents</span>
                        <span>{folders.filter(folder => folder.space_id === space.id).length} dossiers</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template</h3>
                <p className="text-sm text-gray-500">
                  Les templates de documents apparaîtront ici.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal pour nouveau document */}
      {isCreateDocumentOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouveau Document</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCreateDocumentOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newDocument = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                file_type: formData.get('file_type') as string,
                status: 'draft' as const,
              };
              
              handleCreateDocument(newDocument);
            }}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titre du document"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description du document"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select 
                    name="category"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Documentation Technique">Documentation Technique</option>
                    <option value="Procédures RH">Procédures RH</option>
                    <option value="Formations">Formations</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de fichier</label>
                  <select 
                    name="file_type"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">Word</option>
                    <option value="txt">Texte</option>
                    <option value="md">Markdown</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setIsCreateDocumentOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}