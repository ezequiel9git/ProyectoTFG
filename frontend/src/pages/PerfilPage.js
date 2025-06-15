import React, { useContext } from 'react';
import { FaUserCircle, FaEnvelope, FaEdit } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import '../index.css';
import '../App.css';

const PerfilPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Fondo decorativo fijo */}
      <div
        style={{
          backgroundImage: "url('/Fondo12.png')",
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
      <div
        className="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg"
        style={{ maxWidth: 420, width: '100%' }}
      >
        <div className="card-body text-center">
          <div className="mb-3">
            <FaUserCircle size={96} color="#015b8f" />
          </div>
          <h3 className="card-title mb-1">{user?.username || 'Usuario'}</h3>
          <p className="text-muted mb-2">
            <FaEnvelope className="me-2" />
            {user?.email || 'Sin email'}
          </p>
          <hr />
          <p className="mb-3">
            Apasionado por la tecnología y el desarrollo web. Siempre aprendiendo cosas nuevas.
          </p>
          <button className="btn btn-editar">
            <FaEdit className="me-2" />
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;