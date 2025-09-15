import mysql from 'mysql2/promise';

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
        const [employees] = await connection.execute(`
          SELECT 
            e.id, e.first_name, e.last_name, e.email, e.phone, e.position, 
            e.department, e.hire_date, e.salary, e.status, e.created_at, e.updated_at
          FROM employees e
          ORDER BY e.created_at DESC
        `);
        await connection.end();
        return res.status(200).json(employees);

      case 'POST':
        const { first_name, last_name, email, phone, position, department, hire_date, salary, status } = req.body;
        if (!first_name || !last_name || !email) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'Prénom, nom et email sont requis' });
        }
        const [resultPost] = await connection.execute(
          `INSERT INTO employees (first_name, last_name, email, phone, position, department, hire_date, salary, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [first_name, last_name, email, phone, position, department, hire_date, salary, status || 'active']
        );
        const [newEmployee] = await connection.execute('SELECT * FROM employees WHERE id = ?', [resultPost.insertId]);
        await connection.end();
        return res.status(201).json(newEmployee[0]);

      case 'PUT':
        const employeeId = req.query.id;
        if (!employeeId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID de l\'employé requis' });
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
        updateValues.push(employeeId);
        await connection.execute(
          `UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        const [updatedEmployee] = await connection.execute('SELECT * FROM employees WHERE id = ?', [employeeId]);
        await connection.end();
        return res.status(200).json(updatedEmployee[0]);

      case 'DELETE':
        const deleteEmployeeId = req.query.id;
        if (!deleteEmployeeId) {
          await connection.end();
          return res.status(400).json({ success: false, message: 'ID de l\'employé requis' });
        }
        await connection.execute('DELETE FROM employees WHERE id = ?', [deleteEmployeeId]);
        await connection.end();
        return res.status(200).json({ success: true, message: 'Employé supprimé avec succès' });

      default:
        await connection.end();
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API employees:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur', error: error.message });
  }
}