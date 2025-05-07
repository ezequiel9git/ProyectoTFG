import React from 'react';
import { useParams } from 'react-router-dom';
import SesionForm from '../components/SesionForm';

const SesionesPage = () => {
  const { pacienteId } = useParams();

  return (
    <div className="container mt-5">
      <h2>Sesiones de Terapia</h2>
      <p className="mb-4">
        Registra aquí una nueva sesión para uno de tus pacientes.
      </p>
      {pacienteId ? (
        <SesionForm pacienteId={pacienteId} />
      ) : (
        <div className="alert alert-warning">
          No se pudo encontrar el ID del paciente.
        </div>
      )}
    </div>
  );
};

export default SesionesPage;
