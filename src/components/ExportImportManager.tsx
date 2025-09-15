import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  File, 
  FileImage,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  exportData, 
  importData, 
  validateImportedData, 
  getExportTemplate,
  ExportOptions,
  ImportOptions 
} from '../utils/exportUtils';

interface ExportImportManagerProps {
  data: any[];
  module: 'employees' | 'documents' | 'tasks' | 'users';
  onImport?: (data: any[]) => void;
  onExport?: (format: string) => void;
  requiredFields?: string[];
}

export const ExportImportManager: React.FC<ExportImportManagerProps> = ({
  data,
  module,
  onImport,
  onExport,
  requiredFields = []
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportFormats = [
    { id: 'xlsx', name: 'Excel', icon: FileSpreadsheet, color: 'text-green-600' },
    { id: 'csv', name: 'CSV', icon: FileText, color: 'text-blue-600' },
    { id: 'json', name: 'JSON', icon: File, color: 'text-yellow-600' },
    { id: 'pdf', name: 'PDF', icon: FileImage, color: 'text-red-600' }
  ];

  const handleExport = async (format: string) => {
    if (data.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format: format as any,
        filename: `${module}_export_${new Date().toISOString().split('T')[0]}`,
        includeHeaders: true
      };

      await exportData(data, options);
      toast.success(`Export ${format.toUpperCase()} réussi`);
      onExport?.(format);
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportErrors([]);
    setImportedData([]);

    try {
      // Déterminer le format du fichier
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let format: string;
      
      switch (fileExtension) {
        case 'xlsx':
        case 'xls':
          format = 'xlsx';
          break;
        case 'csv':
          format = 'csv';
          break;
        case 'json':
          format = 'json';
          break;
        default:
          throw new Error('Format de fichier non supporté');
      }

      const options: ImportOptions = {
        format: format as any,
        validateData: true,
        skipEmptyRows: true
      };

      const imported = await importData(file, options);
      
      // Valider les données si des champs requis sont spécifiés
      if (requiredFields.length > 0) {
        const validation = validateImportedData(imported, requiredFields);
        if (!validation.isValid) {
          setImportErrors(validation.errors);
          toast.error('Données invalides importées');
          return;
        }
      }

      setImportedData(imported);
      setShowPreview(true);
      toast.success(`${imported.length} enregistrements importés avec succès`);
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Erreur lors de l\'import');
    } finally {
      setIsImporting(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = () => {
    if (importedData.length > 0) {
      onImport?.(importedData);
      setShowPreview(false);
      setImportedData([]);
      toast.success('Données importées avec succès');
    }
  };

  const handleCancelImport = () => {
    setShowPreview(false);
    setImportedData([]);
    setImportErrors([]);
  };

  const downloadTemplate = () => {
    const template = getExportTemplate(module);
    const options: ExportOptions = {
      format: 'xlsx',
      filename: `template_${module}`,
      includeHeaders: true
    };
    exportData(template, options);
    toast.success('Template téléchargé');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export des Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exportFormats.map((format) => {
              const IconComponent = format.icon;
              return (
                <Button
                  key={format.id}
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={() => handleExport(format.id)}
                  disabled={isExporting || data.length === 0}
                >
                  <IconComponent className={`h-6 w-6 mb-2 ${format.color}`} />
                  <span className="text-sm font-medium">{format.name}</span>
                  <span className="text-xs text-gray-500">
                    {data.length} enregistrement{data.length !== 1 ? 's' : ''}
                  </span>
                </Button>
              );
            })}
          </div>
          
          {data.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-700">
                  Aucune donnée disponible pour l'export
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Import des Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Importer depuis un fichier</h4>
                <p className="text-sm text-gray-500">
                  Formats supportés: Excel (.xlsx), CSV (.csv), JSON (.json)
                </p>
              </div>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.json"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Import en cours...' : 'Sélectionner un fichier'}
              </Button>
            </div>

            {requiredFields.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Champs requis:</h5>
                <div className="flex flex-wrap gap-2">
                  {requiredFields.map((field) => (
                    <Badge key={field} className="bg-blue-100 text-blue-800">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des données importées */}
      {showPreview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Aperçu des Données Importées
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelImport}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {importErrors.length > 0 ? (
              <div className="space-y-3">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-900 mb-2">Erreurs de validation:</h4>
                  <ul className="space-y-1">
                    {importErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={handleCancelImport} className="w-full">
                  Fermer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {importedData.length} enregistrement{importedData.length !== 1 ? 's' : ''} prêt{importedData.length !== 1 ? 's' : ''} à importer
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Valide
                  </Badge>
                </div>

                {importedData.length > 0 && (
                  <div className="max-h-64 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(importedData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importedData.slice(0, 5).map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                              >
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importedData.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        ... et {importedData.length - 5} autre{importedData.length - 5 !== 1 ? 's' : ''} enregistrement{importedData.length - 5 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleConfirmImport} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmer l'import
                  </Button>
                  <Button variant="outline" onClick={handleCancelImport} className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
