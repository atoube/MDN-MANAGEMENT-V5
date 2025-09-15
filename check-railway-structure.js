// Vérification de la structure des tables Railway
import mysql from 'mysql2/promise';

async function checkRailwayStructure() {
  console.log('🔍 Vérification de la structure des tables Railway...\n');

  const dbConfig = {
    host: 'centerbeam.proxy.rlwy.net',
    port: 26824,
    user: 'root',
    password: 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
    database: 'railway',
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false }
  };

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion réussie !\n');

    // Vérifier la structure de la table tasks
    console.log('📋 Structure de la table tasks:');
    const [tasksStructure] = await connection.execute('DESCRIBE tasks');
    tasksStructure.forEach(column => {
      console.log(`  📊 ${column.Field} (${column.Type}) - ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n📋 Structure de la table employees:');
    const [employeesStructure] = await connection.execute('DESCRIBE employees');
    employeesStructure.forEach(column => {
      console.log(`  📊 ${column.Field} (${column.Type}) - ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n📋 Structure de la table users:');
    const [usersStructure] = await connection.execute('DESCRIBE users');
    usersStructure.forEach(column => {
      console.log(`  📊 ${column.Field} (${column.Type}) - ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Test des données avec les bonnes colonnes
    console.log('\n👥 Données des employés:');
    const [employees] = await connection.execute('SELECT id, first_name, last_name, email, department FROM employees LIMIT 5');
    employees.forEach(emp => {
      console.log(`  👤 ${emp.first_name} ${emp.last_name} (${emp.department}) - ${emp.email}`);
    });

    console.log('\n📋 Données des tâches:');
    const [tasks] = await connection.execute('SELECT * FROM tasks LIMIT 3');
    tasks.forEach(task => {
      console.log(`  📝 ID: ${task.id}, Titre: ${task.title || 'N/A'}, Statut: ${task.status || 'N/A'}`);
    });

    console.log('\n👤 Données des utilisateurs:');
    const [users] = await connection.execute('SELECT id, email, role, created_at FROM users LIMIT 5');
    users.forEach(user => {
      console.log(`  👤 ${user.email} (${user.role}) - Créé: ${user.created_at}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

checkRailwayStructure();
