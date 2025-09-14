import React from 'react';

const ApiTasks: React.FC = () => {
  const data = {
    success: true,
    data: [
      {
        id: 1,
        title: "Développer la nouvelle interface utilisateur",
        description: "Créer une interface moderne et responsive pour le tableau de bord",
        status: "in_progress",
        priority: "high",
        assigned_to: 1,
        created_by: 1,
        due_date: "2024-02-15",
        created_at: "2024-01-10T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z",
        assigned_first_name: "Jean",
        assigned_last_name: "Dupont",
        created_first_name: "Admin",
        created_last_name: "MADON"
      },
      {
        id: 2,
        title: "Réviser les contrats clients",
        description: "Examiner et mettre à jour tous les contrats en cours",
        status: "todo",
        priority: "medium",
        assigned_to: 4,
        created_by: 1,
        due_date: "2024-02-20",
        created_at: "2024-01-12T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z",
        assigned_first_name: "Sophie",
        assigned_last_name: "Laurent",
        created_first_name: "Admin",
        created_last_name: "MADON"
      },
      {
        id: 3,
        title: "Préparer la présentation Q1",
        description: "Créer la présentation pour la réunion trimestrielle",
        status: "completed",
        priority: "high",
        assigned_to: 2,
        created_by: 1,
        due_date: "2024-01-30",
        completed_at: "2024-01-29T16:30:00.000Z",
        created_at: "2024-01-05T00:00:00.000Z",
        updated_at: "2024-01-29T16:30:00.000Z",
        assigned_first_name: "Marie",
        assigned_last_name: "Martin",
        created_first_name: "Admin",
        created_last_name: "MADON"
      }
    ],
    count: 3
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

export default ApiTasks;
