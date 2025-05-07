import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import SesionForm from '../components/SesionForm';

const PacienteDetailPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [paciente, setPaciente] = useState(null);
  const [sesiones, setSesiones] = useState([]);

  const ordenarPorFechaDesc = sesiones =>
    [...sesiones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const res = await axios.get(`/api/pacientes/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setPaciente(res.data);
      } catch (err) {
        console.error('Error al obtener paciente:', err);
      }
    };

    const fetchSesiones = async () => {
      try {
        const res = await axios.get(`/api/pacientes/${id}/sesiones/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setSesiones(ordenarPorFechaDesc(res.data));
      } catch (err) {
        console.error('Error al obtener sesiones:', err);
      }
    };

    fetchPaciente();
    fetchSesiones();
  }, [id, authTokens]);

  const handleSesionCreada = nuevaSesion => {
    setSesiones(prev => ordenarPorFechaDesc([nuevaSesion, ...prev]));
  };

  return (
    <div className="container mt-5">
      {paciente ? (
        <>
          <h2>{paciente.nombre}</h2>
          <p><strong>Edad:</strong> {paciente.edad}</p>
          <p><strong>Motivo de consulta:</strong> {paciente.motivo_consulta}</p>

          <SesionForm pacienteId={id} onSesionCreada={handleSesionCreada} />

          <h4 className="mt-5">Sesiones</h4>
          {sesiones.length === 0 ? (
            <p>No hay sesiones registradas aún.</p>
          ) : (
            sesiones.map(sesion => (
              <div key={sesion.id} className="card my-3 p-3 shadow-sm">
                <p><strong>Fecha:</strong> {sesion.fecha}</p>
                <p><strong>Duración:</strong> {sesion.duracion} min</p>
                <p><strong>Estado emocional:</strong> {sesion.estado_emocional}</p>
                <p><strong>Seguimiento de hábitos:</strong> {sesion.seguimiento_habitos}</p>
                <p><strong>Actividades:</strong> {sesion.actividades}</p>
                <p><strong>Próxima sesión:</strong> {sesion.proxima_sesion}</p>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Cargando información del paciente...</p>
      )}
    </div>
  );
};

export default PacienteDetailPage;
