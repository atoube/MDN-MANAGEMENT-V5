// Test local des API routes
const mysql = require('mysql2/promise');

// Simuler les variables d'environnement Railway
process.env.RAILWAY_DB_HOST = 'centerbeam.proxy.rlwy.net';
process.env.RAILWAY_DB_PORT = '26824';
process.env.RAILWAY_DB_USER = 'root';
process.env.RAILWAY_DB_PASSWORD = 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD';
process.env.RAILWAY_DB_NAME = 'railway';
process.env.RAILWAY_DB_SSL = 'false';

async function testAPI() {
  console.log('🧪 Test des API routes localement...\n');

  try {
    // Test de connexion
    console.log('1️⃣ Test de connexion Railway...');
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST,
      port: parseInt(process.env.RAILWAY_DB_PORT),
      user: process.env.RAILWAY_DB_USER,
      password: process.env.RAILWAY_DB_PASSWORD,
      database: process.env.RAILWAY_DB_NAME,
      ssl: process.env.RAILWAY_DB_SSL === 'true'
    });

    await connection.execute('SELECT 1 as test');
    console.log('✅ Connexion Railway réussie !\n');

    // Test employés
    console.log('2️⃣ Test API employés...');
    const [employees] = await connection.execute(`
      SELECT 
        e.id, e.first_name, e.last_name, e.email, e.phone, e.position, 
        e.department, e.hire_date, e.salary, e.status, e.created_at, e.updated_at
      FROM employees e
      ORDER BY e.created_at DESC
      LIMIT 3
    `);
    console.log(`✅ ${employees.length} employés récupérés:`);
    employees.forEach(emp => {
      console.log(`   - ${emp.first_name} ${emp.last_name} (${emp.email})`);
    });
    console.log('');

    // Test tâches
    console.log('3️⃣ Test API tâches...');
    const [tasks] = await connection.execute(`
      SELECT 
        t.id, t.title, t.description, t.status, t.priority, t.assigned_to, 
        t.created_by, t.due_date, t.completed_at, t.created_at, t.updated_at,
        e.first_name as assigned_employee_first_name, e.last_name as assigned_employee_last_name,
        u.first_name as created_by_employee_first_name, u.last_name as created_by_employee_last_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
      LIMIT 3
    `);
    console.log(`✅ ${tasks.length} tâches récupérées:`);
    tasks.forEach(task => {
      console.log(`   - ${task.title} [${task.status}] - Priorité: ${task.priority}`);
    });
    console.log('');

    // Test documents
    console.log('4️⃣ Test API documents...');
    const [documents] = await connection.execute(`
      SELECT 
        d.id, d.title, d.description, d.file_path, d.file_type, d.file_size, 
        d.category, d.status, d.uploaded_by, d.created_at, d.updated_at,
        u.first_name as author_first_name, u.last_name as author_last_name
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      ORDER BY d.created_at DESC
      LIMIT 3
    `);
    console.log(`✅ ${documents.length} documents récupérés:`);
    documents.forEach(doc => {
      console.log(`   - ${doc.title} [${doc.category}] - ${doc.status}`);
    });

    await connection.end();
    console.log('\n🎉 Tous les tests API sont réussis !');
    console.log('📋 Résumé:');
    console.log(`   - Connexion Railway: ✅`);
    console.log(`   - Employés: ${employees.length} enregistrements`);
    console.log(`   - Tâches: ${tasks.length} enregistrements`);
    console.log(`   - Documents: ${documents.length} enregistrements`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI();
