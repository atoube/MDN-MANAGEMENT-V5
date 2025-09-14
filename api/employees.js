// API route pour la gestion des employés
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
        return await getEmployees(req, res, connection);
      case 'POST':
        return await createEmployee(req, res, connection);
      case 'PUT':
        return await updateEmployee(req, res, connection);
      case 'DELETE':
        return await deleteEmployee(req, res, connection);
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans employees API:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
}

// Récupérer tous les employés
async function getEmployees(req, res, connection) {
  try {
    const { search, department, status } = req.query;
    
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR position LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (department && department !== 'all') {
      query += ' AND department = ?';
      params.push(department);
    }
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await connection.execute(query, params);
    
    return res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des employés',
      error: error.message
    });
  }
}

// Créer un nouvel employé
async function createEmployee(req, res, connection) {
  try {
    const { first_name, last_name, email, phone, position, department, hire_date, salary } = req.body;
    
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Les champs prénom, nom et email sont obligatoires'
      });
    }
    
    const [result] = await connection.execute(`
      INSERT INTO employees (first_name, last_name, email, phone, position, department, hire_date, salary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, email, phone, position, department, hire_date, salary]);
    
    return res.status(201).json({
      success: true,
      message: 'Employé créé avec succès',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'employé',
      error: error.message
    });
  }
}

// Mettre à jour un employé
async function updateEmployee(req, res, connection) {
  try {
    const { id } = req.query;
    const { first_name, last_name, email, phone, position, department, hire_date, salary, status } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'employé requis'
      });
    }
    
    const [result] = await connection.execute(`
      UPDATE employees 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, position = ?, department = ?, hire_date = ?, salary = ?, status = ?
      WHERE id = ?
    `, [first_name, last_name, email, phone, position, department, hire_date, salary, status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Employé mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'employé',
      error: error.message
    });
  }
}

// Supprimer un employé
async function deleteEmployee(req, res, connection) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'employé requis'
      });
    }
    
    const [result] = await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Employé supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'employé',
      error: error.message
    });
  }
}
