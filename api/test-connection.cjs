const mysql = require('mysql2/promise');

module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Configuration Railway
    const connection = await mysql.createConnection({
      host: process.env.RAILWAY_DB_HOST || 'centerbeam.proxy.rlwy.net',
      port: parseInt(process.env.RAILWAY_DB_PORT || '26824'),
      user: process.env.RAILWAY_DB_USER || 'root',
      password: process.env.RAILWAY_DB_PASSWORD || 'eNMmLvQjDIBHXwPmEqaVutQQDKTwEKsD',
      database: process.env.RAILWAY_DB_NAME || 'railway',
      ssl: process.env.RAILWAY_DB_SSL === 'true'
    });

    // Test de connexion
    await connection.execute('SELECT 1 as test');
    await connection.end();

    return res.status(200).json({
      success: true,
      message: 'Connexion Railway réussie !',
      timestamp: new Date().toISOString(),
      database: 'railway'
    });
  } catch (error) {
    console.error('Erreur de connexion Railway:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur de connexion Railway',
      error: error.message
    });
  }
}