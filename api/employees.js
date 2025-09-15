// API route pour les employés - Railway
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
        // Récupérer tous les employés
        const [employees] = await connection.execute(`
          SELECT 
            e.id, e.user_id, e.employee_id, e.first_name, e.last_name, 
            e.email, e.phone, e.position, e.department, e.hire_date, 
            e.salary, e.status, e.avatar_url, e.created_at, e.updated_at
          FROM employees e
          ORDER BY e.first_name, e.last_name
        `);

        res.status(200).json({
          success: true,
          employees: employees,
          count: employees.length
        });
        break;

      case 'POST':
        // Créer un nouvel employé
        const {
          user_id,
          employee_id,
          first_name,
          last_name,
          email,
          phone,
          position,
          department,
          hire_date,
          salary,
          status = 'active'
        } = req.body;

        if (!first_name || !last_name || !email) {
          return res.status(400).json({
            success: false,
            message: 'Prénom, nom et email sont requis'
          });
        }

        const [result] = await connection.execute(
          `INSERT INTO employees 
           (user_id, employee_id, first_name, last_name, email, phone, position, department, hire_date, salary, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [user_id, employee_id, first_name, last_name, email, phone, position, department, hire_date, salary, status]
        );

        // Récupérer l'employé créé
        const [newEmployee] = await connection.execute(
          'SELECT * FROM employees WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json({
          success: true,
          message: 'Employé créé avec succès',
          employee: newEmployee[0]
        });
        break;

      default:
        res.status(405).json({
          success: false,
          message: 'Méthode non autorisée'
        });
    }
  } catch (error) {
    console.error('Erreur dans l\'API employees:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};