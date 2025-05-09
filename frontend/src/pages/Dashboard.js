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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bienvenido, {user && user.username}</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card shadow rounded-4 p-4">
            <h4>Pacientes</h4>
            <p>Gestiona tu lista de pacientes y accede a sus sesiones individuales.</p>
            <Link to="/pacientes" className="btn btn-primary">
              Ir a Pacientes
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow rounded-4 p-4">
            <h4>Reportes</h4>
            <p>Consulta estadísticas relevantes de pacientes y sesiones.</p>
            <Link to="/reportes" className="btn btn-secondary">
              Ver Reportes
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow rounded-4 p-4">
            <h4>Agenda</h4>
            <p>Visualiza y gestiona tus citas terapéuticas en el calendario.</p>
            <Link to="/agenda" className="btn btn-success">
              Ir a Agenda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
