import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header
      className="shadow-sm mb-4"
      style={{
        background: 'linear-gradient(90deg,rgb(14, 95, 68) 0%,rgb(75, 1, 75) 100%)',
        color: '#fff',
      }}
    >
      <div className="container d-flex flex-wrap justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center gap-3">
          <img src="/Logo9.png" alt="Logo de la aplicación" height="40" />
          <h5 className="mb-0">Bienvenido, {user?.username}</h5>
        </div>

        <nav className="d-flex align-items-center gap-3 mt-2 mt-md-0">
          <Link to="/dashboard" className="text-white text-decoration-none fw-semibold">
            Dashboard
          </Link>
          <Link to="/pacientes" className="text-white text-decoration-none fw-semibold">
            Pacientes
          </Link>
          <Link to="/reportes" className="text-white text-decoration-none fw-semibold">
            Reportes
          </Link>
          <Link to="/agenda" className="text-white text-decoration-none fw-semibold">
            Agenda
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-light btn-sm ms-2"
            style={{ fontWeight: '600' }}
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
