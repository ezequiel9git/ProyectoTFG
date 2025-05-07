import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SesionForm from './SesionForm';
import SesionList from './SesionList';

const PacienteDetail = () => {
  const { authTokens } = useContext(AuthContext);
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPaciente = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/pacientes/${id}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setPaciente(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los detalles del paciente.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaciente();
  }, [id]);

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando detalles del paciente...</p>
      ) : (
        <>
          <h3>{paciente.nombre}</h3>
          <p><strong>Edad:</strong> {paciente.edad}</p>
          <p><strong>Teléfono:</strong> {paciente.telefono}</p>
          <p><strong>Dirección:</strong> {paciente.direccion}</p>
          <p><strong>Asunto:</strong> {paciente.asunto || '-'}</p>
          <p><strong>Medicación:</strong> {paciente.medicacion || '-'}</p>
          <p><strong>Prioridad de seguimiento:</strong> {paciente.prioridad_seguimiento}</p>

          <SesionForm pacienteId={id} onSesionCreada={() => fetchPaciente()} />
          <SesionList pacienteId={id} />
        </>
      )}
    </div>
  );
};

export default PacienteDetail;
