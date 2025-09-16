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
        const [tasks] = await connection.execute(`
          SELECT 
            t.id, t.title, t.description, t.status, t.priority, t.assigned_to, 
            t.created_by, t.due_date, t.completed_at, t.created_at, t.updated_at,
            e.first_name as assigned_employee_first_name, e.last_name as assigned_employee_last_name,
            u.first_name as created_by_employee_first_name, u.last_name as created_by_employee_last_name
          FROM tasks t
          LEFT JOIN employees e ON t.assigned_to = e.id
          LEFT JOIN users u ON t.created_by = u.id
          ORDER BY t.created_at DESC
        `);
        await connection.end();
        return res.status(200).json(tasks);

      case 'POST':
        const { title, description, status, priority, assigned_to, created_by, due_date } = req.body;
        if (!title || !status || !priority || !created_by) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'Titre, statut, priorité et créateur sont requis' });
        }
        const [resultPost] = await connection.execute(
          `INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, status, priority, assigned_to, created_by, due_date]
        );
        const [newTask] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [resultPost.insertId]);
        await connection.end();
        return res.status(201).json(newTask[0]);

      case 'PUT':
        const taskId = req.query.id;
        if (!taskId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID de la tâche requis' });
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
        if (updateData.status === 'completed' && !updateData.completed_at) {
          updateFields.push('completed_at = NOW()');
        } else if (updateData.status !== 'completed' && updateData.completed_at === null) {
          updateFields.push('completed_at = NULL');
        }
        updateValues.push(taskId);
        await connection.execute(
          `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        const [updatedTask] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);
        await connection.end();
        return res.status(200).json(updatedTask[0]);

      case 'DELETE':
        const deleteTaskId = req.query.id;
        if (!deleteTaskId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID de la tâche requis' });
        }
        await connection.execute('DELETE FROM tasks WHERE id = ?', [deleteTaskId]);
        await connection.end();
        return res.status(200).json({ success: true, message: 'Tâche supprimée avec succès' });

      default:
        await connection.end();
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API tasks:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur', error: error.message });
  }
}