import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import PrivateLayout from './layouts/PrivateLayout';
import PerfilPage from './pages/PerfilPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PacientesPage from './pages/PacientesPage';
import SesionesPage from './pages/SesionesPage';
import PacienteDetailPage from './pages/PacienteDetailPage';
import SesionDetailPage from './pages/SesionDetailPage';
import ReportesPage from './pages/ReportesPage';
import AgendaPage from './pages/AgendaPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas con layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
                path="/perfil"
                element={ 
                  <PrivateRoute>
                    <PrivateLayout>
                      <PerfilPage />
                    </PrivateLayout>
                  </PrivateRoute>
                }
              />
          <Route
            path="/pacientes"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <PacientesPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes/:id"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <PacienteDetailPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes/:pacienteId/sesiones"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <SesionesPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sesiones/:id"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <SesionDetailPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <ReportesPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <PrivateRoute>
                <PrivateLayout>
                  <AgendaPage />
                </PrivateLayout>
              </PrivateRoute>
            }
          />

          {/* Redirección raíz */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
