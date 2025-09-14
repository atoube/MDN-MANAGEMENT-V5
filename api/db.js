// Configuration de la base de données pour Railway
import mysql from 'mysql2/promise';

// Configuration de la connexion
const dbConfig = {
  host: process.env.RAILWAY_DB_HOST || process.env.VITE_DB_HOST || 'localhost',
  port: process.env.RAILWAY_DB_PORT || process.env.VITE_DB_PORT || 3306,
  user: process.env.RAILWAY_DB_USER || process.env.VITE_DB_USER || 'root',
  password: process.env.RAILWAY_DB_PASSWORD || process.env.VITE_DB_PASSWORD || '',
  database: process.env.RAILWAY_DB_NAME || process.env.VITE_DB_NAME || 'MDN_SUITE',
  ssl: process.env.RAILWAY_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de connexions
let pool = null;

export const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test de connexion
export const testConnection = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    return { success: true, message: 'Connexion réussie', data: rows };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return { success: false, message: error.message, error };
  }
};

// Initialisation de la base de données
export const initDatabase = async () => {
  try {
    const connection = await getConnection();
    
    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.execute(`USE \`${dbConfig.database}\``);
    
    // Créer les tables principales
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user', 'manager') DEFAULT 'user',
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        employee_id VARCHAR(50) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        position VARCHAR(100),
        department VARCHAR(100),
        hire_date DATE,
        salary DECIMAL(10,2),
        status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100),
        file_size INT,
        category VARCHAR(100),
        status ENUM('draft', 'review', 'approved', 'published') DEFAULT 'draft',
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('todo', 'in_progress', 'completed', 'cancelled') DEFAULT 'todo',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        assigned_to INT,
        created_by INT,
        due_date DATE,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    // Insérer des données de test
    await insertTestData(connection);
    
    return { success: true, message: 'Base de données initialisée avec succès' };
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);
    return { success: false, message: error.message, error };
  }
};

// Insérer des données de test
const insertTestData = async (connection) => {
  try {
    // Vérifier si des données existent déjà
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count > 0) return;
    
    // Insérer l'utilisateur admin
    await connection.execute(`
      INSERT INTO users (email, password, first_name, last_name, role) 
      VALUES ('admin@madon.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'MADON', 'admin')
    `);
    
    // Insérer des employés de test
    const employees = [
      ['Jean', 'Dupont', 'jean.dupont@madon.com', '+33 1 23 45 67 89', 'Développeur Senior', 'IT', '2022-01-15'],
      ['Marie', 'Martin', 'marie.martin@madon.com', '+33 1 23 45 67 90', 'Chef de Projet', 'Management', '2021-03-20'],
      ['Pierre', 'Durand', 'pierre.durand@madon.com', '+33 1 23 45 67 91', 'Designer UX/UI', 'Design', '2023-06-10'],
      ['Sophie', 'Laurent', 'sophie.laurent@madon.com', '+33 1 23 45 67 92', 'Responsable RH', 'RH', '2020-09-05']
    ];
    
    for (const [firstName, lastName, email, phone, position, department, hireDate] of employees) {
      await connection.execute(`
        INSERT INTO employees (first_name, last_name, email, phone, position, department, hire_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [firstName, lastName, email, phone, position, department, hireDate]);
    }
    
    console.log('Données de test insérées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données de test:', error);
  }
};

export default { getConnection, testConnection, initDatabase };
