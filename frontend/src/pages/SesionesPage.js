import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SesionForm from '../components/SesionForm';
import SesionList from '../components/SesionList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Página para gestionar las sesiones de un paciente
const SesionesPage = () => {
  // Obtiene el ID del paciente desde la URL
  const { pacienteId } = useParams();
  // Estado para la sesión que se está editando (null si no hay ninguna)
  const [sesionEditada, setSesionEditada] = useState(null);
  // Estado para controlar la pestaña activa ('lista' o 'formulario')
  const [activeTab, setActiveTab] = useState('lista');
  // Estado para mostrar mensajes tipo toast tras acciones exitosas
  const [toastMensaje, setToastMensaje] = useState(null);

  // Maneja la creación o edición de una sesión y muestra el mensaje correspondiente
  const handleSesionCreada = (accion) => {
    setSesionEditada(null);
    setActiveTab('lista');
    if (accion === 'creada') setToastMensaje('Sesión creada con éxito.');
    if (accion === 'editada') setToastMensaje('Sesión editada con éxito.');
  };

  // Maneja la selección de una sesión para editar
  const handleEditarSesion = (sesion) => {
    setSesionEditada(sesion);
    setActiveTab('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancela la edición de una sesión
  const cancelarEdicion = () => {
    setSesionEditada(null);
  };

  // Muestra mensaje toast al eliminar una sesión
  const handleToastEliminada = () => {
    setToastMensaje('Sesión eliminada con éxito.');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      {/* Fondo decorativo */}
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
        {/* Encabezado de la página */}
        <div className="d-flex align-items-center mb-1">
          <img src="/ListaSesionesLogo.png" alt="Icono de sesiones" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Archivo de sesiones</h2><br />
            <p className="text-muted fst-italic">Consulta los informes de evaluación del paciente y crea nuevos.</p>
          </div>
        </div>

        {/* Navegación por pestañas */}
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

        {/* Contenido de la pestaña activa */}
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
          // Mensaje de advertencia si no se encuentra el ID del paciente
          <div className="alert alert-warning text-center">
            No se pudo encontrar el ID del paciente.
          </div>
        )}
      </div>
      {/* Contenedor para mensajes toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SesionesPage;
