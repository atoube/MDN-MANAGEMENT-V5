import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Employees from './pages/Employees';
import Documents from './pages/Documents';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import ApiHello from './pages/ApiHello';
import ApiTestConnection from './pages/ApiTestConnection';
import ApiEmployees from './pages/ApiEmployees';
import ApiTasks from './pages/ApiTasks';
import Test from './pages/Test';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
            <Route path="/data/hello" element={<ApiHello />} />
            <Route path="/data/test-connection" element={<ApiTestConnection />} />
            <Route path="/data/employees" element={<ApiEmployees />} />
            <Route path="/data/tasks" element={<ApiTasks />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="home" element={<Home />} />
              <Route path="employees" element={<Employees />} />
              <Route path="documents" element={<Documents />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;