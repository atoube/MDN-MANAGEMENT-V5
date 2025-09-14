#!/usr/bin/env node

// Script de migration intelligent vers Railway
import mysql from 'mysql2/promise';
import fs from 'fs';

// Configuration de la base locale
const localConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
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

async function smartMigrate() {
  let localConnection = null;
  let railwayConnection = null;

  try {
    console.log('🚀 Migration intelligente vers Railway...\n');

    // Connexions
    console.log('📡 Connexion à la base locale...');
    localConnection = await mysql.createConnection(localConfig);
    console.log('✅ Connexion locale réussie\n');

    console.log('🚂 Connexion à Railway...');
    railwayConnection = await mysql.createConnection(railwayConfig);
    console.log('✅ Connexion Railway réussie\n');

    // Vider les tables Railway existantes
    console.log('🧹 Nettoyage des tables Railway...');
    await railwayConnection.execute('DELETE FROM users');
    await railwayConnection.execute('DELETE FROM employees');
    await railwayConnection.execute('DELETE FROM tasks');
    await railwayConnection.execute('DELETE FROM documents');
    console.log('✅ Tables Railway nettoyées\n');

    // Migrer les utilisateurs
    console.log('👤 Migration des utilisateurs...');
    await migrateUsers(localConnection, railwayConnection);

    // Migrer les employés
    console.log('👥 Migration des employés...');
    await migrateEmployees(localConnection, railwayConnection);

    // Migrer les tâches
    console.log('✅ Migration des tâches...');
    await migrateTasks(localConnection, railwayConnection);

    // Migrer les documents
    console.log('📄 Migration des documents...');
    await migrateDocuments(localConnection, railwayConnection);

    console.log('🎉 Migration intelligente terminée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Mettre à jour les variables Vercel');
    console.log('2. Redéployer l\'application');
    console.log('3. Tester : https://mdn-management-v5.vercel.app/api/test-connection');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
  } finally {
    if (localConnection) await localConnection.end();
    if (railwayConnection) await railwayConnection.end();
  }
}

async function migrateUsers(localConn, railwayConn) {
  try {
    const [users] = await localConn.execute('SELECT * FROM users');
    console.log(`  📊 ${users.length} utilisateurs trouvés`);

    for (const user of users) {
      await railwayConn.execute(`
        INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.email,
        user.password_hash || 'admin123',
        user.name ? user.name.split(' ')[0] : 'User',
        user.name ? user.name.split(' ').slice(1).join(' ') : 'Name',
        user.role || 'user',
        user.created_at || new Date(),
        user.updated_at || new Date()
      ]);
    }
    console.log(`  ✅ ${users.length} utilisateurs migrés`);
  } catch (error) {
    console.error(`  ❌ Erreur migration utilisateurs:`, error.message);
  }
}

async function migrateEmployees(localConn, railwayConn) {
  try {
    const [employees] = await localConn.execute('SELECT * FROM employees');
    console.log(`  📊 ${employees.length} employés trouvés`);

    for (const emp of employees) {
      await railwayConn.execute(`
        INSERT INTO employees (id, first_name, last_name, email, phone, position, department, hire_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        emp.id,
        emp.first_name,
        emp.last_name,
        emp.email,
        emp.phone,
        emp.position,
        emp.department,
        emp.hire_date,
        emp.status || 'active',
        emp.created_at || new Date(),
        emp.updated_at || new Date()
      ]);
    }
    console.log(`  ✅ ${employees.length} employés migrés`);
  } catch (error) {
    console.error(`  ❌ Erreur migration employés:`, error.message);
  }
}

async function migrateTasks(localConn, railwayConn) {
  try {
    const [tasks] = await localConn.execute('SELECT * FROM tasks');
    console.log(`  📊 ${tasks.length} tâches trouvées`);

    for (const task of tasks) {
      await railwayConn.execute(`
        INSERT INTO tasks (id, title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        task.id,
        task.title,
        task.description,
        task.status || 'todo',
        task.priority || 'medium',
        task.assigned_to,
        task.created_by || 1,
        task.due_date,
        task.created_at || new Date(),
        task.updated_at || new Date()
      ]);
    }
    console.log(`  ✅ ${tasks.length} tâches migrées`);
  } catch (error) {
    console.error(`  ❌ Erreur migration tâches:`, error.message);
  }
}

async function migrateDocuments(localConn, railwayConn) {
  try {
    const [docs] = await localConn.execute('SELECT * FROM documents');
    console.log(`  📊 ${docs.length} documents trouvés`);

    for (const doc of docs) {
      await railwayConn.execute(`
        INSERT INTO documents (id, title, description, file_path, file_type, file_size, category, status, uploaded_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        doc.id,
        doc.name || doc.title,
        doc.description,
        doc.url || doc.file_path || '/uploads/' + doc.name,
        doc.type || doc.file_type,
        doc.size || doc.file_size,
        doc.category,
        doc.status || 'draft',
        doc.uploaded_by || 1,
        doc.created_at || new Date(),
        doc.updated_at || new Date()
      ]);
    }
    console.log(`  ✅ ${docs.length} documents migrés`);
  } catch (error) {
    console.error(`  ❌ Erreur migration documents:`, error.message);
  }
}

// Exécuter la migration
smartMigrate().catch(console.error);
