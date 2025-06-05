import React, { useState } from 'react';
import PacienteForm from '../components/PacienteForm';
import PacienteList from '../components/PacienteList';

// Página principal para la gestión de pacientes
const PacientesPage = () => {
  // Estado para el paciente que se está editando (null si no hay ninguno)
  const [pacienteEditado, setPacienteEditado] = useState(null);
  // Estado para forzar la recarga de la lista de pacientes tras crear/editar
  const [recargarLista, setRecargarLista] = useState(false);
  // Estado para controlar la pestaña activa ('lista' o 'formulario')
  const [activeTab, setActiveTab] = useState('lista');
  // Estado para mostrar mensajes tipo toast tras acciones exitosas
  const [toastMensaje, setToastMensaje] = useState(null);

  // Maneja la selección de un paciente para editar
  const handleEditar = (paciente) => {
    setPacienteEditado(paciente);
    setActiveTab('formulario'); // Cambia automáticamente a la pestaña de formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Maneja el éxito del formulario (creación o edición)
  // Cambia la pestaña, recarga la lista y muestra un mensaje
  const handleFormularioExito = (accion) => {
    setPacienteEditado(null);
    setRecargarLista(prev => !prev);
    setActiveTab('lista'); // Vuelve a la pestaña de lista tras guardar
    if (accion === 'creado') setToastMensaje('Paciente creado con éxito.');
    if (accion === 'editado') setToastMensaje('Paciente editado con éxito.');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      {/* Fondo decorativo */}
      <div
        style={{
          backgroundImage: "url('/Fondo8.png')",
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

      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        {/* Encabezado de la página */}
        <div className="d-flex align-items-center mb-1">
          <img src="/ListaPacientesLogo.png" alt="Icono de pacientes" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Registro de pacientes</h2><br></br>
            <p className="text-muted fst-italic">Consulta la información de tus pacientes y registra nuevos.</p>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'lista' ? 'active' : ''}`}
              onClick={() => setActiveTab('lista')}
            >
              <img src="/ListaPacientesLogo.png" alt="Lista" style={{ height: '20px', marginRight: '6px' }} />
              Lista de Pacientes
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'formulario' ? 'active' : ''}`}
              onClick={() => setActiveTab('formulario')}
            >
              <img src="/AgregarPacientesLogo.png" alt="Agregar" style={{ height: '20px', marginRight: '6px' }} />
              Agregar nuevo paciente
            </button>
          </li>
        </ul>

        {/* Contenido de la pestaña activa */}
        <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: "2px solid #fd8ed3" }}>
          {activeTab === 'lista' && (
            <PacienteList
              onEditarPaciente={handleEditar}
              recargarTrigger={recargarLista}
              toastMensaje={toastMensaje}
              limpiarToastMensaje={() => setToastMensaje(null)}
            />
          )}

          {activeTab === 'formulario' && (
            <PacienteForm
              pacienteEditado={pacienteEditado}
              onExito={handleFormularioExito}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PacientesPage;
