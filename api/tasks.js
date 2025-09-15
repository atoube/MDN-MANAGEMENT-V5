// API route pour les tâches - Railway
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
        // Récupérer toutes les tâches
        const [tasks] = await connection.execute(`
          SELECT 
            t.*,
            u1.first_name as assigned_first_name,
            u1.last_name as assigned_last_name,
            u2.first_name as created_first_name,
            u2.last_name as created_last_name
          FROM tasks t
          LEFT JOIN users u1 ON t.assigned_to = u1.id
          LEFT JOIN users u2 ON t.created_by = u2.id
          ORDER BY t.created_at DESC
        `);

        res.status(200).json(tasks);
        break;

      case 'POST':
        // Créer une nouvelle tâche
        const {
          title,
          description,
          status = 'todo',
          priority = 'medium',
          assigned_to,
          created_by,
          due_date
        } = req.body;

        if (!title || !created_by) {
          return res.status(400).json({
            success: false,
            message: 'Titre et créateur sont requis'
          });
        }

        const [result] = await connection.execute(
          `INSERT INTO tasks 
           (title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, status, priority, assigned_to, created_by, due_date]
        );

        // Récupérer la tâche créée
        const [newTask] = await connection.execute(
          'SELECT * FROM tasks WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json(newTask[0]);
        break;

      case 'PUT':
        // Mettre à jour une tâche
        const taskId = req.query.id;
        if (!taskId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID tâche requis' 
          });
        }

        const updateData = req.body;

        // Vérifier si la tâche existe
        const [existingTask] = await connection.execute(
          'SELECT id FROM tasks WHERE id = ?',
          [taskId]
        );

        if (existingTask.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Tâche non trouvée' 
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
        updateValues.push(taskId);

        await connection.execute(
          `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );

        // Récupérer la tâche mise à jour
        const [updatedTask] = await connection.execute(
          'SELECT * FROM tasks WHERE id = ?',
          [taskId]
        );

        res.status(200).json(updatedTask[0]);
        break;

      case 'DELETE':
        // Supprimer une tâche
        const deleteTaskId = req.query.id;
        if (!deleteTaskId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID tâche requis' 
          });
        }

        // Vérifier si la tâche existe
        const [existingTaskDelete] = await connection.execute(
          'SELECT id FROM tasks WHERE id = ?',
          [deleteTaskId]
        );

        if (existingTaskDelete.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Tâche non trouvée' 
          });
        }

        // Supprimer la tâche
        await connection.execute(
          'DELETE FROM tasks WHERE id = ?',
          [deleteTaskId]
        );

        res.status(200).json({ 
          success: true, 
          message: 'Tâche supprimée avec succès' 
        });
        break;

      default:
        res.status(405).json({
          success: false,
          message: 'Méthode non autorisée'
        });
    }
  } catch (error) {
    console.error('Erreur dans l\'API tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};