#!/usr/bin/env node

// Script de migration final vers Railway
import mysql from 'mysql2/promise';

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

async function finalMigrate() {
  let localConnection = null;
  let railwayConnection = null;

  try {
    console.log('🚀 Migration finale vers Railway...\n');

    // Connexions
    localConnection = await mysql.createConnection(localConfig);
    railwayConnection = await mysql.createConnection(railwayConfig);
    console.log('✅ Connexions établies\n');

    // Désactiver les contraintes de clés étrangères temporairement
    await railwayConnection.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Contraintes de clés étrangères désactivées\n');

    // Vider toutes les tables
    console.log('🧹 Nettoyage complet des tables...');
    await railwayConnection.execute('DELETE FROM tasks');
    await railwayConnection.execute('DELETE FROM employees');
    await railwayConnection.execute('DELETE FROM users');
    await railwayConnection.execute('DELETE FROM documents');
    console.log('✅ Tables nettoyées\n');

    // Migrer les utilisateurs avec gestion des rôles
    console.log('👤 Migration des utilisateurs...');
    await migrateUsersFixed(localConnection, railwayConnection);

    // Migrer les employés
    console.log('👥 Migration des employés...');
    await migrateEmployeesFixed(localConnection, railwayConnection);

    // Migrer les tâches
    console.log('✅ Migration des tâches...');
    await migrateTasksFixed(localConnection, railwayConnection);

    // Réactiver les contraintes
    await railwayConnection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Contraintes de clés étrangères réactivées\n');

    // Vérifier les données migrées
    console.log('📊 Vérification des données migrées...');
    await verifyMigration(railwayConnection);

    console.log('🎉 Migration finale terminée avec succès !');
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

async function migrateUsersFixed(localConn, railwayConn) {
  try {
    const [users] = await localConn.execute('SELECT * FROM users');
    console.log(`  📊 ${users.length} utilisateurs trouvés`);

    for (const user of users) {
      // Normaliser le rôle
      let role = 'user';
      if (user.role) {
        if (user.role.includes('admin') || user.role.includes('Admin')) {
          role = 'admin';
        } else if (user.role.includes('manager') || user.role.includes('Manager')) {
          role = 'manager';
        }
      }

      // Séparer le nom
      const nameParts = (user.name || 'User Name').split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Name';

      await railwayConn.execute(`
        INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.email,
        user.password_hash || 'admin123',
        firstName,
        lastName,
        role,
        user.created_at || new Date(),
        user.updated_at || new Date()
      ]);
    }
    console.log(`  ✅ ${users.length} utilisateurs migrés`);
  } catch (error) {
    console.error(`  ❌ Erreur migration utilisateurs:`, error.message);
  }
}

async function migrateEmployeesFixed(localConn, railwayConn) {
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

async function migrateTasksFixed(localConn, railwayConn) {
  try {
    const [tasks] = await localConn.execute('SELECT * FROM tasks');
    console.log(`  📊 ${tasks.length} tâches trouvées`);

    for (const task of tasks) {
      // Vérifier que l'utilisateur assigné existe
      let assignedTo = task.assigned_to;
      if (assignedTo) {
        const [userExists] = await railwayConn.execute('SELECT id FROM users WHERE id = ?', [assignedTo]);
        if (userExists.length === 0) {
          assignedTo = 1; // Assigner à l'admin par défaut
        }
      }

      await railwayConn.execute(`
        INSERT INTO tasks (id, title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        task.id,
        task.title,
        task.description,
        task.status || 'todo',
        task.priority || 'medium',
        assignedTo,
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

async function verifyMigration(railwayConn) {
  try {
    const [users] = await railwayConn.execute('SELECT COUNT(*) as count FROM users');
    const [employees] = await railwayConn.execute('SELECT COUNT(*) as count FROM employees');
    const [tasks] = await railwayConn.execute('SELECT COUNT(*) as count FROM tasks');
    const [documents] = await railwayConn.execute('SELECT COUNT(*) as count FROM documents');

    console.log(`  👤 Utilisateurs: ${users[0].count}`);
    console.log(`  👥 Employés: ${employees[0].count}`);
    console.log(`  ✅ Tâches: ${tasks[0].count}`);
    console.log(`  📄 Documents: ${documents[0].count}`);
  } catch (error) {
    console.error(`  ❌ Erreur vérification:`, error.message);
  }
}

// Exécuter la migration
finalMigrate().catch(console.error);
