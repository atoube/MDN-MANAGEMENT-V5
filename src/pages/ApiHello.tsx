import React from 'react';

const ApiHello: React.FC = () => {
  const data = {
    success: true,
    message: "API route fonctionne !",
    timestamp: new Date().toISOString(),
    method: "GET",
    url: "/api/hello"
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

export default ApiHello;
