import React from 'react';

const ApiEmployees: React.FC = () => {
  const data = {
    success: true,
    data: [
      {
        id: 1,
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@madon.com",
        phone: "+33 1 23 45 67 89",
        position: "Développeur Senior",
        department: "IT",
        hire_date: "2022-01-15",
        status: "active",
        created_at: "2022-01-15T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 2,
        first_name: "Marie",
        last_name: "Martin",
        email: "marie.martin@madon.com",
        phone: "+33 1 23 45 67 90",
        position: "Chef de Projet",
        department: "Management",
        hire_date: "2021-03-20",
        status: "active",
        created_at: "2021-03-20T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 3,
        first_name: "Pierre",
        last_name: "Durand",
        email: "pierre.durand@madon.com",
        phone: "+33 1 23 45 67 91",
        position: "Designer UX/UI",
        department: "Design",
        hire_date: "2023-06-10",
        status: "active",
        created_at: "2023-06-10T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 4,
        first_name: "Sophie",
        last_name: "Laurent",
        email: "sophie.laurent@madon.com",
        phone: "+33 1 23 45 67 92",
        position: "Responsable RH",
        department: "RH",
        hire_date: "2020-09-05",
        status: "active",
        created_at: "2020-09-05T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 5,
        first_name: "Ahmed",
        last_name: "Benali",
        email: "ahmed.benali@madon.com",
        phone: "+33 1 23 45 67 93",
        position: "Analyste Financier",
        department: "Finance",
        hire_date: "2021-11-15",
        status: "active",
        created_at: "2021-11-15T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 6,
        first_name: "Fatima",
        last_name: "Ouali",
        email: "fatima.ouali@madon.com",
        phone: "+33 1 23 45 67 94",
        position: "Marketing Manager",
        department: "Marketing",
        hire_date: "2022-05-10",
        status: "active",
        created_at: "2022-05-10T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 7,
        first_name: "Youssef",
        last_name: "Alami",
        email: "youssef.alami@madon.com",
        phone: "+33 1 23 45 67 95",
        position: "Développeur Full Stack",
        department: "IT",
        hire_date: "2023-02-20",
        status: "active",
        created_at: "2023-02-20T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 8,
        first_name: "Amina",
        last_name: "Tazi",
        email: "amina.tazi@madon.com",
        phone: "+33 1 23 45 67 96",
        position: "Comptable",
        department: "Finance",
        hire_date: "2020-12-01",
        status: "active",
        created_at: "2020-12-01T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 9,
        first_name: "Karim",
        last_name: "Bennani",
        email: "karim.bennani@madon.com",
        phone: "+33 1 23 45 67 97",
        position: "Responsable Ventes",
        department: "Sales",
        hire_date: "2021-08-15",
        status: "active",
        created_at: "2021-08-15T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      },
      {
        id: 10,
        first_name: "Laila",
        last_name: "Chraibi",
        email: "laila.chraibi@madon.com",
        phone: "+33 1 23 45 67 98",
        position: "Assistante Administrative",
        department: "Administration",
        hire_date: "2023-09-01",
        status: "active",
        created_at: "2023-09-01T00:00:00.000Z",
        updated_at: "2024-01-14T14:30:00.000Z"
      }
    ],
    count: 10
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

export default ApiEmployees;
