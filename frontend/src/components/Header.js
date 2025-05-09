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
    <header className="bg-primary text-white shadow-sm mb-4">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center gap-3">
          <img src="/Logo9.png" alt="Logo de la aplicación" height="40" />
          <h5 className="mb-0">Bienvenido, {user?.username}</h5>
        </div>

        <nav className="d-flex gap-3">
          <Link to="/dashboard" className="text-white text-decoration-none">
            Dashboard
          </Link>
          <Link to="/pacientes" className="text-white text-decoration-none">
            Pacientes
          </Link>
          <Link to="/reportes" className="text-white text-decoration-none">
            Reportes
          </Link>
          <Link to="/agenda" className="text-white text-decoration-none">
            Agenda
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
