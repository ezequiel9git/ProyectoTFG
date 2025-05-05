import React from 'react';
import SesionForm from '../components/SesionForm';

const SesionesPage = () => {
  return (
    <div className="container mt-5">
      <h2>Sesiones de Terapia</h2>
      <p className="mb-4">Registra aquí una nueva sesión para uno de tus pacientes.</p>
      <SesionForm />
    </div>
  );
};

export default SesionesPage;
