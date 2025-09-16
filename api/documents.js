const mysql = require('mysql2/promise');

module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
      port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
      user: process.env.RAILWAY_DB_USER || 'root',
      password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: process.env.RAILWAY_DB_NAME || 'railway',
      ssl: process.env.RAILWAY_DB_SSL === 'true'
    });

    switch (req.method) {
      case 'GET':
        const [documents] = await connection.execute(`
          SELECT 
            d.id, d.title, d.description, d.file_path, d.file_type, d.file_size, 
            d.category, d.status, d.uploaded_by, d.created_at, d.updated_at,
            u.first_name as author_first_name, u.last_name as author_last_name
          FROM documents d
          LEFT JOIN users u ON d.uploaded_by = u.id
          ORDER BY d.created_at DESC
        `);
        await connection.end();
        return res.status(200).json(documents);

      case 'POST':
        const { title, description, file_path, file_type, file_size, category, status, uploaded_by } = req.body;
        if (!title || !file_path || !uploaded_by) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'Titre, chemin du fichier et ID de l\'uploader sont requis' });
        }
        const [resultPost] = await connection.execute(
          `INSERT INTO documents (title, description, file_path, file_type, file_size, category, status, uploaded_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, file_path, file_type, file_size, category, status, uploaded_by]
        );
        const [newDocument] = await connection.execute('SELECT * FROM documents WHERE id = ?', [resultPost.insertId]);
        await connection.end();
        return res.status(201).json(newDocument[0]);

      case 'PUT':
        const documentId = req.query.id;
        if (!documentId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID du document requis' });
        }
        const updateData = req.body;
        const updateFields = [];
        const updateValues = [];
        for (const key in updateData) {
          if (updateData[key] !== undefined) {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        }
        if (updateFields.length === 0) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'Aucune donnée à mettre à jour' });
        }
        updateFields.push('updated_at = NOW()');
        updateValues.push(documentId);
        await connection.execute(
          `UPDATE documents SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        const [updatedDocument] = await connection.execute('SELECT * FROM documents WHERE id = ?', [documentId]);
        await connection.end();
        return res.status(200).json(updatedDocument[0]);

      case 'DELETE':
        const deleteDocumentId = req.query.id;
        if (!deleteDocumentId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID du document requis' });
        }
        await connection.execute('DELETE FROM documents WHERE id = ?', [deleteDocumentId]);
        await connection.end();
        return res.status(200).json({ success: true, message: 'Document supprimé avec succès' });

      default:
        await connection.end();
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API documents:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur', error: error.message });
  }
}