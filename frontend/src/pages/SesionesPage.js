import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SesionForm from '../components/SesionForm';
import SesionList from '../components/SesionList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SesionesPage = () => {
  const { pacienteId } = useParams();
  const [sesionEditada, setSesionEditada] = useState(null);
  const [activeTab, setActiveTab] = useState('lista');
  const [toastMensaje, setToastMensaje] = useState(null);

  const handleSesionCreada = (accion) => {
    setSesionEditada(null);
    setActiveTab('lista');
    if (accion === 'creada') setToastMensaje('Sesión creada con éxito.');
    if (accion === 'editada') setToastMensaje('Sesión editada con éxito.');
  };

  const handleEditarSesion = (sesion) => {
    setSesionEditada(sesion);
    setActiveTab('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setSesionEditada(null);
  };

  const handleToastEliminada = () => {
    setToastMensaje('Sesión eliminada con éxito.');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      <div
        style={{
          backgroundImage: "url('/Fondo13.png')",
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
      <div className="card p-1 shadow rounded-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="d-flex align-items-center mb-1">
          <img src="/ListaSesionesLogo.png" alt="Icono de sesiones" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Archivo de sesiones</h2><br />
            <p className="text-muted fst-italic">Consulta los informes de evaluación del paciente y crea nuevos.</p>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'lista' ? 'active' : ''}`}
              onClick={() => setActiveTab('lista')}
            >
              <img src="/ListaSesionesLogo.png" alt="Icono Lista" style={{ width: '20px', marginRight: '8px' }} />
              Lista de sesiones
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'formulario' ? 'active' : ''}`}
              onClick={() => setActiveTab('formulario')}
            >
              <img src="/AgregarSesionesLogo.png" alt="Icono Formulario" style={{ width: '20px', marginRight: '8px' }} />
              Registrar sesión
            </button>
          </li>
        </ul>

        {pacienteId ? (
          <>
            {activeTab === 'lista' && (
              <SesionList
                pacienteId={pacienteId}
                onEditarSesion={handleEditarSesion}
                onSesionEliminada={handleToastEliminada}
                toastMensaje={toastMensaje}
                limpiarToastMensaje={() => setToastMensaje(null)}
              />
            )}

            {activeTab === 'formulario' && (
              <SesionForm
                pacienteId={pacienteId}
                onSesionCreada={handleSesionCreada}
                sesionEditada={sesionEditada}
                onFinalizarEdicion={cancelarEdicion}
              />
            )}
          </>
        ) : (
          <div className="alert alert-warning text-center">
            No se pudo encontrar el ID del paciente.
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SesionesPage;
