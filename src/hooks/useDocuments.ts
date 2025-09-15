import { useState, useEffect } from 'react';
import { useRailwayConnection } from './useRailwayConnection';

export interface Document {
  id: number;
  title: string;
  description?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  status?: 'draft' | 'review' | 'approved' | 'published' | 'deleted';
  uploaded_by?: number;
  author_first_name?: string;
  author_last_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  space_id?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery, isConnected } = useRailwayConnection();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des documents');
      }
      
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : (data.documents || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur useDocuments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du document');
      }

      const newDocument = await response.json();
      setDocuments(prev => [...prev, newDocument]);
      return newDocument;
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      throw error;
    }
  };

  const updateDocument = async (id: number, documentData: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du document');
      }

      const updatedDocument = await response.json();
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument : doc)
      );
      return updatedDocument;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
      throw error;
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      throw error;
    }
  };

  // Données mockées pour les espaces et dossiers (en attendant l'API)
  const loadMockData = () => {
    const mockSpaces: Space[] = [
      {
        id: '1',
        name: 'Documentation Technique',
        description: 'Documentation technique et guides de développement',
        color: '#3B82F6',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Procédures RH',
        description: 'Procédures et politiques des ressources humaines',
        color: '#10B981',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Formations',
        description: 'Matériel de formation et guides utilisateur',
        color: '#F59E0B',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const mockFolders: Folder[] = [
      {
        id: '1',
        name: 'API Documentation',
        description: 'Documentation des APIs',
        space_id: '1',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Guides de Déploiement',
        description: 'Guides pour le déploiement',
        space_id: '1',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Politiques',
        description: 'Politiques d\'entreprise',
        space_id: '2',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    setSpaces(mockSpaces);
    setFolders(mockFolders);
  };

  useEffect(() => {
    fetchDocuments();
    loadMockData();
  }, []);

  return { 
    documents, 
    spaces,
    folders,
    loading, 
    error, 
    fetchDocuments,
    createDocument, 
    updateDocument, 
    deleteDocument 
  };
};
