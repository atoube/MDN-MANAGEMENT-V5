// API route pour la gestion des tâches
import { getConnection } from './db.js';

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const connection = await getConnection();
    
    switch (req.method) {
      case 'GET':
        return await getTasks(req, res, connection);
      case 'POST':
        return await createTask(req, res, connection);
      case 'PUT':
        return await updateTask(req, res, connection);
      case 'DELETE':
        return await deleteTask(req, res, connection);
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans tasks API:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
}

// Récupérer toutes les tâches
async function getTasks(req, res, connection) {
  try {
    const { search, status, priority, assigned_to } = req.query;
    
    let query = `
      SELECT t.*, 
             u1.first_name as assigned_first_name, 
             u1.last_name as assigned_last_name,
             u2.first_name as created_first_name, 
             u2.last_name as created_last_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE 1=1
    `;
    const params = [];
    
    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (status && status !== 'all') {
      query += ' AND t.status = ?';
      params.push(status);
    }
    
    if (priority && priority !== 'all') {
      query += ' AND t.priority = ?';
      params.push(priority);
    }
    
    if (assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }
    
    query += ' ORDER BY t.created_at DESC';
    
    const [rows] = await connection.execute(query, params);
    
    return res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches',
      error: error.message
    });
  }
}

// Créer une nouvelle tâche
async function createTask(req, res, connection) {
  try {
    const { title, description, priority, assigned_to, due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Le titre de la tâche est obligatoire'
      });
    }
    
    const [result] = await connection.execute(`
      INSERT INTO tasks (title, description, priority, assigned_to, due_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, priority || 'medium', assigned_to, due_date, 1]); // created_by = 1 (admin)
    
    return res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la tâche',
      error: error.message
    });
  }
}

// Mettre à jour une tâche
async function updateTask(req, res, connection) {
  try {
    const { id } = req.query;
    const { title, description, status, priority, assigned_to, due_date } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de la tâche requis'
      });
    }
    
    const updateFields = [];
    const params = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      params.push(status);
      if (status === 'completed') {
        updateFields.push('completed_at = NOW()');
      }
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      params.push(priority);
    }
    if (assigned_to !== undefined) {
      updateFields.push('assigned_to = ?');
      params.push(assigned_to);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date = ?');
      params.push(due_date);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ à mettre à jour'
      });
    }
    
    params.push(id);
    
    const [result] = await connection.execute(`
      UPDATE tasks 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Tâche mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la tâche',
      error: error.message
    });
  }
}

// Supprimer une tâche
async function deleteTask(req, res, connection) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de la tâche requis'
      });
    }
    
    const [result] = await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Tâche supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la tâche',
      error: error.message
    });
  }
}
