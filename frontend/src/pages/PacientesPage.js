import React, { useState } from 'react';
import PacienteForm from '../components/PacienteForm';
import PacienteList from '../components/PacienteList';

const PacientesPage = () => {
  const [pacienteEditado, setPacienteEditado] = useState(null);
  const [recargarLista, setRecargarLista] = useState(false);

  const handleEditar = (paciente) => {
    setPacienteEditado(paciente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormularioExito = () => {
    setPacienteEditado(null);
    setRecargarLista(prev => !prev);
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Pacientes</h2>
      <p className="mb-4">Aquí puedes registrar nuevos pacientes y consultar los existentes.</p>

      <PacienteList
        onEditarPaciente={handleEditar}
        recargarTrigger={recargarLista}
      />

      <hr className="my-5" />

      <PacienteForm
        pacienteEditado={pacienteEditado}
        onExito={handleFormularioExito}
      />
    </div>
  );
};

export default PacientesPage;
