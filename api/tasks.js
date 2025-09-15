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
        // Récupérer toutes les tâches avec les informations des employés
        const [tasks] = await connection.execute(`
          SELECT 
            t.id, t.title, t.description, t.status, t.priority, 
            t.assigned_to, t.created_by, t.due_date, t.completed_at, 
            t.created_at, t.updated_at,
            ae.first_name as assigned_first_name,
            ae.last_name as assigned_last_name,
            ae.email as assigned_email,
            ce.first_name as created_first_name,
            ce.last_name as created_last_name,
            ce.email as created_email
          FROM tasks t
          LEFT JOIN employees ae ON t.assigned_to = ae.id
          LEFT JOIN employees ce ON t.created_by = ce.id
          ORDER BY t.created_at DESC
        `);

        // Formater les tâches avec les relations
        const formattedTasks = tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to: task.assigned_to,
          created_by: task.created_by,
          due_date: task.due_date,
          completed_at: task.completed_at,
          created_at: task.created_at,
          updated_at: task.updated_at,
          assigned_employee: task.assigned_to ? {
            id: task.assigned_to,
            first_name: task.assigned_first_name,
            last_name: task.assigned_last_name,
            email: task.assigned_email
          } : null,
          created_by_employee: task.created_by ? {
            id: task.created_by,
            first_name: task.created_first_name,
            last_name: task.created_last_name,
            email: task.created_email
          } : null
        }));

        res.status(200).json({
          success: true,
          tasks: formattedTasks,
          count: formattedTasks.length
        });
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

        if (!title) {
          return res.status(400).json({
            success: false,
            message: 'Le titre est requis'
          });
        }

        const [result] = await connection.execute(
          `INSERT INTO tasks 
           (title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [title, description, status, priority, assigned_to, created_by, due_date]
        );

        // Récupérer la tâche créée avec les relations
        const [newTask] = await connection.execute(`
          SELECT 
            t.id, t.title, t.description, t.status, t.priority, 
            t.assigned_to, t.created_by, t.due_date, t.completed_at, 
            t.created_at, t.updated_at,
            ae.first_name as assigned_first_name,
            ae.last_name as assigned_last_name,
            ae.email as assigned_email,
            ce.first_name as created_first_name,
            ce.last_name as created_last_name,
            ce.email as created_email
          FROM tasks t
          LEFT JOIN employees ae ON t.assigned_to = ae.id
          LEFT JOIN employees ce ON t.created_by = ce.id
          WHERE t.id = ?
        `, [result.insertId]);

        const formattedTask = newTask[0] ? {
          id: newTask[0].id,
          title: newTask[0].title,
          description: newTask[0].description,
          status: newTask[0].status,
          priority: newTask[0].priority,
          assigned_to: newTask[0].assigned_to,
          created_by: newTask[0].created_by,
          due_date: newTask[0].due_date,
          completed_at: newTask[0].completed_at,
          created_at: newTask[0].created_at,
          updated_at: newTask[0].updated_at,
          assigned_employee: newTask[0].assigned_to ? {
            id: newTask[0].assigned_to,
            first_name: newTask[0].assigned_first_name,
            last_name: newTask[0].assigned_last_name,
            email: newTask[0].assigned_email
          } : null,
          created_by_employee: newTask[0].created_by ? {
            id: newTask[0].created_by,
            first_name: newTask[0].created_first_name,
            last_name: newTask[0].created_last_name,
            email: newTask[0].created_email
          } : null
        } : null;

        res.status(201).json({
          success: true,
          message: 'Tâche créée avec succès',
          task: formattedTask
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