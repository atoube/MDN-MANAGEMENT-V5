#!/usr/bin/env node

// Script de migration des données locales vers Railway
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Configuration de la base locale (MDN-MANAGEMENT-V4)
const localConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Votre mot de passe local
  database: 'MDN_SUITE'
};

// Configuration Railway
const railwayConfig = {
  host: 'centerbeam.proxy.rlwy.net',
  port: 26824,
  user: 'root',
  password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
  database: 'railway',
  ssl: { rejectUnauthorized: false }
};

async function migrateData() {
  let localConnection = null;
  let railwayConnection = null;

  try {
    console.log('🚀 Début de la migration vers Railway...\n');

    // Connexion à la base locale
    console.log('📡 Connexion à la base locale...');
    localConnection = await mysql.createConnection(localConfig);
    console.log('✅ Connexion locale réussie\n');

    // Connexion à Railway
    console.log('🚂 Connexion à Railway...');
    railwayConnection = await mysql.createConnection(railwayConfig);
    console.log('✅ Connexion Railway réussie\n');

    // Créer les tables sur Railway si elles n'existent pas
    console.log('🏗️  Création des tables sur Railway...');
    await createTables(railwayConnection);
    console.log('✅ Tables créées\n');

    // Migrer les données
    console.log('📊 Migration des données...');
    
    // Migrer les utilisateurs
    await migrateTable(localConnection, railwayConnection, 'users');
    
    // Migrer les employés
    await migrateTable(localConnection, railwayConnection, 'employees');
    
    // Migrer les documents
    await migrateTable(localConnection, railwayConnection, 'documents');
    
    // Migrer les tâches
    await migrateTable(localConnection, railwayConnection, 'tasks');
    
    // Migrer les absences
    await migrateTable(localConnection, railwayConnection, 'absences');
    
    // Migrer les demandes de congé
    await migrateTable(localConnection, railwayConnection, 'leave_requests');
    
    // Migrer les salaires
    await migrateTable(localConnection, railwayConnection, 'salaries');
    
    // Migrer les notifications
    await migrateTable(localConnection, railwayConnection, 'notifications');

    console.log('🎉 Migration terminée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Mettre à jour les variables d\'environnement Vercel');
    console.log('2. Redéployer l\'application');
    console.log('3. Tester la connexion : https://mdn-management-v5.vercel.app/api/test-connection');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Fermer les connexions
    if (localConnection) {
      await localConnection.end();
      console.log('🔌 Connexion locale fermée');
    }
    if (railwayConnection) {
      await railwayConnection.end();
      console.log('🔌 Connexion Railway fermée');
    }
  }
}

async function createTables(connection) {
  // Créer les tables principales
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role ENUM('admin', 'user', 'manager') DEFAULT 'user',
      avatar_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS employees (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS documents (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS tasks (
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
    )`,
    
    `CREATE TABLE IF NOT EXISTS absences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      type ENUM('sick', 'vacation', 'personal', 'other') NOT NULL,
      reason TEXT,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      approved_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS leave_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      type ENUM('annual', 'sick', 'maternity', 'paternity', 'unpaid') NOT NULL,
      reason TEXT,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      approved_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS salaries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      base_salary DECIMAL(10,2) NOT NULL,
      bonus DECIMAL(10,2) DEFAULT 0,
      deductions DECIMAL(10,2) DEFAULT 0,
      net_salary DECIMAL(10,2) NOT NULL,
      month INT NOT NULL,
      year INT NOT NULL,
      status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    await connection.execute(table);
  }
}

async function migrateTable(localConn, railwayConn, tableName) {
  try {
    console.log(`  📋 Migration de la table: ${tableName}`);
    
    // Vérifier si la table existe dans la base locale
    const [localTables] = await localConn.execute('SHOW TABLES LIKE ?', [tableName]);
    if (localTables.length === 0) {
      console.log(`    ⚠️  Table ${tableName} n'existe pas dans la base locale`);
      return;
    }

    // Récupérer les données de la base locale
    const [rows] = await localConn.execute(`SELECT * FROM ${tableName}`);
    console.log(`    📊 ${rows.length} enregistrements trouvés`);

    if (rows.length === 0) {
      console.log(`    ✅ Table ${tableName} vide, migration ignorée`);
      return;
    }

    // Vider la table Railway (si elle existe)
    await railwayConn.execute(`DELETE FROM ${tableName}`);

    // Insérer les données dans Railway
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = Object.values(row);
      const placeholders = columns.map(() => '?').join(', ');
      
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      await railwayConn.execute(query, values);
    }

    console.log(`    ✅ ${rows.length} enregistrements migrés vers Railway`);
  } catch (error) {
    console.error(`    ❌ Erreur lors de la migration de ${tableName}:`, error.message);
  }
}

// Exécuter la migration
migrateData().catch(console.error);
