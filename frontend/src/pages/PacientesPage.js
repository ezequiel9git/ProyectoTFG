import React, { useState } from 'react';
import PacienteForm from '../components/PacienteForm';
import PacienteList from '../components/PacienteList';

const PacientesPage = () => {
  const [pacienteEditado, setPacienteEditado] = useState(null);
  const [recargarLista, setRecargarLista] = useState(false);
  const [activeTab, setActiveTab] = useState('lista');
  const [toastMensaje, setToastMensaje] = useState(null); // NUEVO

  const handleEditar = (paciente) => {
    setPacienteEditado(paciente);
    setActiveTab('formulario'); // Cambia automáticamente a la pestaña de formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cambia la firma para recibir el tipo de acción
  const handleFormularioExito = (accion) => {
    setPacienteEditado(null);
    setRecargarLista(prev => !prev);
    setActiveTab('lista'); // Vuelve a la pestaña de lista tras guardar
    if (accion === 'creado') setToastMensaje('Paciente creado con éxito.');
    if (accion === 'editado') setToastMensaje('Paciente editado con éxito.');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
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
        
      <div className="d-flex align-items-center mb-1">
        <img src="/ListaPacientesLogo.png" alt="Icono de pacientes" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Registro de pacientes</h2><br></br>
            <p className="text-muted fst-italic">Consulta la información de tus pacientes y registra nuevos.</p>
          </div>
      </div>

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
