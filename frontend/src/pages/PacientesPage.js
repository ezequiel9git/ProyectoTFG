import React, { useState } from 'react';
import PacienteForm from '../components/PacienteForm';
import PacienteList from '../components/PacienteList';

const PacientesPage = () => {
  const [pacienteEditado, setPacienteEditado] = useState(null);
  const [recargarLista, setRecargarLista] = useState(false);
  const [activeTab, setActiveTab] = useState('lista');

  const handleEditar = (paciente) => {
    setPacienteEditado(paciente);
    setActiveTab('formulario'); // Cambia automáticamente a la pestaña de formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormularioExito = () => {
    setPacienteEditado(null);
    setRecargarLista(prev => !prev);
    setActiveTab('lista'); // Vuelve a la pestaña de lista tras guardar
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
        <h2 className="mb-4 text-grey">Gestión de Pacientes</h2>

        <ul className="nav nav-tabs mb-4">
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

        <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          {activeTab === 'lista' && (
            <PacienteList onEditarPaciente={handleEditar} recargarTrigger={recargarLista} />
          )}

          {activeTab === 'formulario' && (
            <PacienteForm pacienteEditado={pacienteEditado} onExito={handleFormularioExito} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PacientesPage;
