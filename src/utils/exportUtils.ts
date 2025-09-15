import * as XLSX from 'xlsx';
// @ts-ignore
import { saveAs } from 'file-saver';

export interface ExportOptions {
  format: 'xlsx' | 'csv' | 'json' | 'pdf';
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ImportOptions {
  format: 'xlsx' | 'csv' | 'json';
  validateData?: boolean;
  skipEmptyRows?: boolean;
}

// Export des données vers Excel
export const exportToExcel = (data: any[], options: ExportOptions = { format: 'xlsx' }) => {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}`,
    includeHeaders = true
  } = options;

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: includeHeaders ? Object.keys(data[0] || {}) : undefined
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, `${filename}.xlsx`);
};

// Export des données vers CSV
export const exportToCSV = (data: any[], options: ExportOptions = { format: 'csv' }) => {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}`,
    includeHeaders = true
  } = options;

  if (data.length === 0) return;

  const headers = includeHeaders ? Object.keys(data[0]) : [];
  const csvContent = [
    ...(includeHeaders ? [headers.join(',')] : []),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Échapper les virgules et guillemets dans les valeurs CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// Export des données vers JSON
export const exportToJSON = (data: any[], options: ExportOptions = { format: 'json' }) => {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}`
  } = options;

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
};

// Export des données vers PDF (utilise jsPDF)
export const exportToPDF = async (data: any[], options: ExportOptions = { format: 'pdf' }) => {
  const {
    filename = `export_${new Date().toISOString().split('T')[0]}`
  } = options;

  // Import dynamique de jsPDF
  const { jsPDF } = await import('jspdf');
  const { autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();
  
  // Configuration du tableau
  const tableData = data.map(row => Object.values(row) as string[]);
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  autoTable(doc, {
    head: [headers],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 20 },
  });

  doc.save(`${filename}.pdf`);
};

// Fonction d'export universelle
export const exportData = async (data: any[], options: ExportOptions) => {
  try {
    switch (options.format) {
      case 'xlsx':
        exportToExcel(data, options);
        break;
      case 'csv':
        exportToCSV(data, options);
        break;
      case 'json':
        exportToJSON(data, options);
        break;
      case 'pdf':
        await exportToPDF(data, options);
        break;
      default:
        throw new Error(`Format non supporté: ${options.format}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
};

// Import des données depuis Excel
export const importFromExcel = (file: File, options: ImportOptions = { format: 'xlsx' }): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const processedData = options.skipEmptyRows 
          ? jsonData.filter((row: any) => Object.values(row).some((value: any) => value !== '' && value != null))
          : jsonData;
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
};

// Import des données depuis CSV
export const importFromCSV = (file: File, options: ImportOptions = { format: 'csv' }): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
        
        const processedData = options.skipEmptyRows 
          ? data.filter(row => Object.values(row).some(value => value !== '' && value != null))
          : data;
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsText(file);
  });
};

// Import des données depuis JSON
export const importFromJSON = (file: File, options: ImportOptions = { format: 'json' }): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonText = e.target?.result as string;
        const data = JSON.parse(jsonText);
        
        if (!Array.isArray(data)) {
          throw new Error('Le fichier JSON doit contenir un tableau de données');
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsText(file);
  });
};

// Fonction d'import universelle
export const importData = (file: File, options: ImportOptions): Promise<any[]> => {
  switch (options.format) {
    case 'xlsx':
      return importFromExcel(file, options);
    case 'csv':
      return importFromCSV(file, options);
    case 'json':
      return importFromJSON(file, options);
    default:
      throw new Error(`Format non supporté: ${options.format}`);
  }
};

// Validation des données importées
export const validateImportedData = (data: any[], requiredFields: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(data)) {
    errors.push('Les données doivent être un tableau');
    return { isValid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('Aucune donnée trouvée');
    return { isValid: false, errors };
  }
  
  // Vérifier les champs requis
  const firstRow = data[0];
  const missingFields = requiredFields.filter(field => !(field in firstRow));
  
  if (missingFields.length > 0) {
    errors.push(`Champs manquants: ${missingFields.join(', ')}`);
  }
  
  // Vérifier les types de données
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (field in row && row[field] === '') {
        errors.push(`Ligne ${index + 1}: Le champ '${field}' ne peut pas être vide`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Templates d'export pour différents modules
export const getExportTemplate = (module: 'employees' | 'documents' | 'tasks' | 'users') => {
  const templates = {
    employees: [
      {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 1 23 45 67 89',
        position: 'Développeur',
        department: 'IT',
        hire_date: '2024-01-15',
        salary: 50000,
        status: 'active'
      }
    ],
    documents: [
      {
        title: 'Document exemple',
        description: 'Description du document',
        category: 'Technique',
        file_type: 'pdf',
        status: 'published'
      }
    ],
    tasks: [
      {
        title: 'Tâche exemple',
        description: 'Description de la tâche',
        status: 'todo',
        priority: 'medium',
        due_date: '2024-12-31'
      }
    ],
    users: [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        role: 'admin'
      }
    ]
  };
  
  return templates[module];
};
