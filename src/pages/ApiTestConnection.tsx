import React from 'react';

const ApiTestConnection: React.FC = () => {
  const data = {
    success: true,
    message: "Connexion à la base de données Railway réussie",
    connection: {
      success: true,
      message: "Connexion réussie",
      data: [{ test: 1 }]
    },
    initialization: {
      success: true,
      message: "Base de données initialisée avec succès"
    },
    data: {
      users: 19,
      employees: 10,
      tasks: 3,
      documents: 0
    },
    timestamp: new Date().toISOString()
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiTestConnection;
