import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png'; // Cambia la ruta si tu logo está en otro lugar

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" height="40" className="me-2" />
          <span className="fw-bold">Mi App Terapéutica</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pacientes">Pacientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agenda">Agenda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reportes">Reportes</Link>
            </li>
            <li className="nav-item ms-3">
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
            {user && (
              <li className="nav-item ms-3 text-muted small">
                Usuario: <strong>{user.username}</strong>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
