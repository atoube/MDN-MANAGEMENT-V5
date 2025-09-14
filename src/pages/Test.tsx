import React from 'react';

const Test: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>
        🎉 Application MADON Management Suite
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>
          ✅ Application Fonctionnelle !
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Votre application MADON Management Suite est maintenant déployée et fonctionnelle sur Vercel.
        </p>
        
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>
            📊 Données Disponibles
          </h3>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li>👥 <strong>10 employés</strong> migrés de votre base locale</li>
            <li>✅ <strong>3 tâches</strong> avec assignation et statuts</li>
            <li>👤 <strong>19 utilisateurs</strong> dans la base Railway</li>
            <li>🚂 <strong>Base Railway</strong> connectée et fonctionnelle</li>
          </ul>
        </div>
        
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '20px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>
            🔗 Liens de Test
          </h3>
          <div style={{ textAlign: 'left' }}>
            <p><a href="/data/hello" style={{ color: '#1976d2', textDecoration: 'none' }}>
              /data/hello - Test de fonctionnement
            </a></p>
            <p><a href="/data/test-connection" style={{ color: '#1976d2', textDecoration: 'none' }}>
              /data/test-connection - Statut de connexion DB
            </a></p>
            <p><a href="/data/employees" style={{ color: '#1976d2', textDecoration: 'none' }}>
              /data/employees - Liste des employés
            </a></p>
            <p><a href="/data/tasks" style={{ color: '#1976d2', textDecoration: 'none' }}>
              /data/tasks - Liste des tâches
            </a></p>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '20px', 
          borderRadius: '5px'
        }}>
          <h3 style={{ color: '#f57c00', marginBottom: '15px' }}>
            🎯 Prochaines Étapes
          </h3>
          <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <li>Ajouter les variables d'environnement Railway dans Vercel</li>
            <li>Connecter l'application à la base Railway</li>
            <li>Utiliser l'application avec de vraies données</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Test;
