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

        res.status(200).json(employees);
        break;

      case 'POST':
        // Créer un nouvel employé
        const {
          first_name,
          last_name,
          email,
          phone,
          position,
          department,
          hire_date,
          salary,
          status = 'active',
          address,
          emergency_contact,
          emergency_phone
        } = req.body;

        if (!first_name || !last_name || !email) {
          return res.status(400).json({
            success: false,
            message: 'Prénom, nom et email sont requis'
          });
        }

        // Vérifier si l'email existe déjà
        const [existingEmployee] = await connection.execute(
          'SELECT id FROM employees WHERE email = ?',
          [email]
        );

        if (existingEmployee.length > 0) {
          return res.status(400).json({ 
            success: false,
            message: 'Un employé avec cet email existe déjà' 
          });
        }

        const [result] = await connection.execute(
          `INSERT INTO employees 
           (first_name, last_name, email, phone, position, department, hire_date, salary, status, address, emergency_contact, emergency_phone, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [first_name, last_name, email, phone, position, department, hire_date, salary, status, address, emergency_contact, emergency_phone]
        );

        // Récupérer l'employé créé
        const [newEmployee] = await connection.execute(
          'SELECT * FROM employees WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json(newEmployee[0]);
        break;

      case 'PUT':
        // Mettre à jour un employé
        const employeeId = req.query.id;
        if (!employeeId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID employé requis' 
          });
        }

        const updateData = req.body;

        // Vérifier si l'employé existe
        const [existingEmployeeUpdate] = await connection.execute(
          'SELECT id FROM employees WHERE id = ?',
          [employeeId]
        );

        if (existingEmployeeUpdate.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Employé non trouvé' 
          });
        }

        // Vérifier si l'email existe déjà pour un autre employé
        if (updateData.email) {
          const [emailCheck] = await connection.execute(
            'SELECT id FROM employees WHERE email = ? AND id != ?',
            [updateData.email, employeeId]
          );

          if (emailCheck.length > 0) {
            return res.status(400).json({ 
              success: false,
              message: 'Un employé avec cet email existe déjà' 
            });
          }
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
        updateValues.push(employeeId);

        await connection.execute(
          `UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );

        // Récupérer l'employé mis à jour
        const [updatedEmployee] = await connection.execute(
          'SELECT * FROM employees WHERE id = ?',
          [employeeId]
        );

        res.status(200).json(updatedEmployee[0]);
        break;

      case 'DELETE':
        // Supprimer un employé
        const deleteEmployeeId = req.query.id;
        if (!deleteEmployeeId) {
          return res.status(400).json({ 
            success: false,
            message: 'ID employé requis' 
          });
        }

        // Vérifier si l'employé existe
        const [existingEmployeeDelete] = await connection.execute(
          'SELECT id FROM employees WHERE id = ?',
          [deleteEmployeeId]
        );

        if (existingEmployeeDelete.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'Employé non trouvé' 
          });
        }

        // Supprimer l'employé
        await connection.execute(
          'DELETE FROM employees WHERE id = ?',
          [deleteEmployeeId]
        );

        res.status(200).json({ 
          success: true, 
          message: 'Employé supprimé avec succès' 
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