// API route pour les utilisateurs - Railway
const { getConnection } = require('./db.cjs');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const connection = await getConnection();

    switch (req.method) {
      case 'GET':
        // Récupérer tous les utilisateurs (sans mots de passe)
        const [users] = await connection.execute(`
          SELECT 
            id, email, first_name, last_name, role, avatar_url, created_at, updated_at
          FROM users
          ORDER BY first_name, last_name
        `);

        res.status(200).json({
          success: true,
          users: users,
          count: users.length
        });
        break;

      case 'POST':
        // Créer un nouvel utilisateur
        const {
          email,
          password,
          first_name,
          last_name,
          role = 'user',
          avatar_url
        } = req.body;

        if (!email || !password || !first_name || !last_name) {
          return res.status(400).json({
            success: false,
            message: 'Email, mot de passe, prénom et nom sont requis'
          });
        }

        // Vérifier si l'email existe déjà
        const [existingUser] = await connection.execute(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingUser.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Un utilisateur avec cet email existe déjà'
          });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.execute(
          `INSERT INTO users 
           (email, password, first_name, last_name, role, avatar_url, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [email, hashedPassword, first_name, last_name, role, avatar_url]
        );

        // Récupérer l'utilisateur créé (sans mot de passe)
        const [newUser] = await connection.execute(
          'SELECT id, email, first_name, last_name, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json({
          success: true,
          message: 'Utilisateur créé avec succès',
          user: newUser[0]
        });
        break;

      default:
        res.status(405).json({
          success: false,
          message: 'Méthode non autorisée'
        });
    }
  } catch (error) {
    console.error('Erreur dans l\'API users:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};
