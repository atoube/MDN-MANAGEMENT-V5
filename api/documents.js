// API route pour les documents - Railway
const { getConnection } = require('./db.js');

module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const connection = await getConnection();

    switch (req.method) {
      case 'GET':
        // Récupérer tous les documents
        const [documents] = await connection.execute(`
          SELECT 
            d.*,
            u.first_name as author_first_name,
            u.last_name as author_last_name
          FROM documents d
          LEFT JOIN users u ON d.uploaded_by = u.id
          ORDER BY d.created_at DESC
        `);

        res.status(200).json(documents);
        break;

      case 'POST':
        // Créer un nouveau document
        const {
          title,
          description,
          file_path,
          file_type,
          file_size,
          category,
          status = 'draft',
          uploaded_by
        } = req.body;

        if (!title || !uploaded_by) {
          return res.status(400).json({
            success: false,
            message: 'Titre et utilisateur sont requis'
          });
        }

        const [result] = await connection.execute(
          `INSERT INTO documents 
           (title, description, file_path, file_type, file_size, category, status, uploaded_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, file_path, file_type, file_size, category, status, uploaded_by]
        );

        // Récupérer le document créé
        const [newDocument] = await connection.execute(
          'SELECT * FROM documents WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json(newDocument[0]);
        break;

      case 'PUT':
        // Mettre à jour un document
        const documentId = req.query.id;
        if (!documentId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID document requis' 
          });
        }

        const updateData = req.body;

        // Vérifier si le document existe
        const [existingDocument] = await connection.execute(
          'SELECT id FROM documents WHERE id = ?',
          [documentId]
        );

        if (existingDocument.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Document non trouvé' 
          });
        }

        // Construire la requête de mise à jour dynamiquement
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateData).forEach(key => {
          if (updateData[key] !== undefined && updateData[key] !== null) {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        });

        if (updateFields.length === 0) {
          return res.status(400).json({ 
            success: false,
            message: 'Aucune donnée à mettre à jour' 
          });
        }

        updateFields.push('updated_at = NOW()');
        updateValues.push(documentId);

        await connection.execute(
          `UPDATE documents SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );

        // Récupérer le document mis à jour
        const [updatedDocument] = await connection.execute(
          'SELECT * FROM documents WHERE id = ?',
          [documentId]
        );

        res.status(200).json(updatedDocument[0]);
        break;

      case 'DELETE':
        // Supprimer un document
        const deleteDocumentId = req.query.id;
        if (!deleteDocumentId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID document requis' 
          });
        }

        // Vérifier si le document existe
        const [existingDocumentDelete] = await connection.execute(
          'SELECT id FROM documents WHERE id = ?',
          [deleteDocumentId]
        );

        if (existingDocumentDelete.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Document non trouvé' 
          });
        }

        // Supprimer le document
        await connection.execute(
          'DELETE FROM documents WHERE id = ?',
          [deleteDocumentId]
        );

        res.status(200).json({ 
          success: true, 
          message: 'Document supprimé avec succès' 
        });
        break;

      default:
        res.status(405).json({
          success: false,
          message: 'Méthode non autorisée'
        });
    }
  } catch (error) {
    console.error('Erreur dans l\'API documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};
