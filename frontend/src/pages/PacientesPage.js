import React from 'react';
import PacienteForm from '../components/PacienteForm';
import PacienteList from '../components/PacienteList';

const PacientesPage = () => {
  return (
    <div className="container mt-5">
      <h2>Gestión de Pacientes</h2>
      <p className="mb-4">Aquí puedes registrar nuevos pacientes y consultar los existentes.</p>

      {/* Formulario para agregar un nuevo paciente */}
      <PacienteForm />

      <hr className="my-5" />

      {/* Lista de pacientes con enlaces a sus detalles */}
      <PacienteList />
    </div>
  );
};

export default PacientesPage;
