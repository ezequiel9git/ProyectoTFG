import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PacientesPage from './pages/PacientesPage';
import SesionesPage from './pages/SesionesPage';
import PacienteDetailPage from './pages/PacienteDetailPage';
import SesionDetailPage from './pages/SesionDetailPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes"
            element={
              <PrivateRoute>
                <PacientesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes/:id"
            element={
              <PrivateRoute>
                <PacienteDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sesiones/:id"
            element={
              <PrivateRoute>
                <SesionDetailPage />
              </PrivateRoute>
            }
          />

          {/* ✅ Ruta corregida con pacienteId dinámico */}
          <Route
            path="/pacientes/:pacienteId/sesiones"
            element={
              <PrivateRoute>
                <SesionesPage />
              </PrivateRoute>
            }
          />

          {/* Ruta raíz: redirecciona al dashboard si autenticado o al login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
