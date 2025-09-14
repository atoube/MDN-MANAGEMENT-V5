#!/usr/bin/env node

// Script pour vérifier la base de données locale
import mysql from 'mysql2/promise';

// Configuration de la base locale (MDN-MANAGEMENT-V4)
const localConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Vous devrez peut-être ajuster ceci
  database: 'MDN_SUITE'
};

async function checkLocalDatabase() {
  let connection = null;

  try {
    console.log('🔍 Vérification de la base de données locale...\n');

    // Test de connexion
    console.log('📡 Connexion à la base locale...');
    connection = await mysql.createConnection(localConfig);
    console.log('✅ Connexion locale réussie !\n');

    // Lister toutes les tables
    console.log('📋 Tables disponibles:');
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('  ⚠️  Aucune table trouvée dans la base locale');
      return;
    }

    // Pour chaque table, afficher le nombre d'enregistrements
    console.log('\n📊 Contenu des tables:');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        const [structure] = await connection.execute(`DESCRIBE ${tableName}`);
        
        console.log(`\n  📋 Table: ${tableName}`);
        console.log(`    📊 Enregistrements: ${count[0].count}`);
        console.log(`    🏗️  Colonnes: ${structure.length}`);
        
        // Afficher quelques colonnes principales
        const mainColumns = structure.slice(0, 5).map(col => col.Field).join(', ');
        console.log(`    📝 Colonnes: ${mainColumns}${structure.length > 5 ? '...' : ''}`);
        
        // Si la table a des données, afficher un échantillon
        if (count[0].count > 0 && count[0].count <= 100) {
          const [sample] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`    📄 Échantillon: ${sample.length} enregistrements`);
        }
        
      } catch (error) {
        console.log(`    ❌ Erreur avec ${tableName}: ${error.message}`);
      }
    }

    console.log('\n🎉 Vérification terminée !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Vérifier que les données sont correctes');
    console.log('2. Exécuter: node migrate-to-railway.js');
    console.log('3. Mettre à jour les variables Vercel');

  } catch (error) {
    console.error('❌ Erreur de connexion locale:', error.message);
    console.error('\n💡 Solutions possibles :');
    console.error('1. Vérifiez que MySQL est démarré');
    console.error('2. Vérifiez le mot de passe dans le script');
    console.error('3. Vérifiez que la base MDN_SUITE existe');
    console.error('4. Vérifiez les permissions de l\'utilisateur root');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion locale fermée');
    }
  }
}

// Exécuter la vérification
checkLocalDatabase().catch(console.error);
