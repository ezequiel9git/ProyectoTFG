import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SesionDetailPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/sesiones/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((res) => {
        setSesion(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar detalles de la sesión:', err);
        setLoading(false);
      });
  }, [id, authTokens]);

  if (loading) return <p>Cargando...</p>;

  if (!sesion) return <p>No se encontró la sesión.</p>;

  return (
    <div className="container mt-5">
      <h2>Detalles de la Sesión</h2>
      <p><strong>Fecha:</strong> {sesion.fecha}</p>
      <p><strong>Duración:</strong> {sesion.duracion} minutos</p>
      <p><strong>Estado emocional:</strong> {sesion.estado_emocional || 'N/A'}</p>
      <p><strong>Evaluación:</strong> {sesion.evaluacion || 'N/A'}</p>
      <p><strong>Seguimiento de hábitos:</strong> {sesion.seguimiento_habitos || 'N/A'}</p>
      <p><strong>Actividades:</strong> {sesion.actividades || 'N/A'}</p>
      <p><strong>Próxima sesión:</strong> {sesion.proxima_sesion || 'N/A'}</p>
      <p><strong>Seguimiento:</strong> {sesion.seguimiento || 'N/A'}</p>
      <Link to={`/pacientes/${sesion.paciente}/sesiones`} className="btn btn-secondary mt-3">
        ← Volver a sesiones del paciente
      </Link>
    </div>
  );
};

export default SesionDetailPage;
