import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
  <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
    <div
      style={{
        backgroundImage: "url('/Fondo2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
    
    <div className="container py-5">
      <div className="container bg-white bg-opacity-75 rounded-4 shadow p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Bienvenido, {user && user.username}</h2>
        </div>
        <p className="mb-5 fs-5">
          Este es tu panel principal. Desde aquí puedes gestionar pacientes, consultar reportes y administrar tu agenda de citas.
        </p>

        <div className="row g-4">
          {/* Pacientes */}
          <div className="col-md-4">
            <div className="card h-100 text-center shadow rounded-4 p-3">
              <img src="/LogoPacientes.png" alt="Pacientes" className="mx-auto" style={{ width: '80px', height: '80px' }} />
              <div className="card-body">
                <h4 className="card-title text-primary">Pacientes</h4>
                <p className="card-text">
                  Gestiona tu lista de pacientes y accede a sus sesiones individuales.
                </p>
                <Link to="/pacientes" className="btn btn-primary">
                  Ir a Pacientes
                </Link>
              </div>
            </div>
          </div>

          {/* Reportes */}
          <div className="col-md-4">
            <div className="card h-100 text-center shadow rounded-4 p-3">
              <img src="/LogoReportes.png" alt="Reportes" className="mx-auto" style={{ width: '80px', height: '80px' }} />
              <div className="card-body">
                <h4 className="card-title text-secondary">Reportes</h4>
                <p className="card-text">
                  Consulta estadísticas relevantes de pacientes y sesiones.
                </p>
                <Link to="/reportes" className="btn btn-secondary">
                  Ver Reportes
                </Link>
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="col-md-4">
            <div className="card h-100 text-center shadow rounded-4 p-3">
              <img src="/LogoAgenda.png" alt="Agenda" className="mx-auto" style={{ width: '80px', height: '80px' }} />
              <div className="card-body">
                <h4 className="card-title text-success">Agenda</h4>
                <p className="card-text">
                  Visualiza y gestiona tus citas terapéuticas en el calendario.
                </p>
                <Link to="/agenda" className="btn btn-success">
                  Ir a Agenda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
