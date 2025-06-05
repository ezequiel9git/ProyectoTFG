import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import SesionForm from '../components/SesionForm';

const PacienteDetailPage = () => {
  // Obtiene el ID del paciente desde la URL
  const { id } = useParams();
  // Obtiene los tokens de autenticación del contexto
  const { authTokens } = useContext(AuthContext);

  // Estado para almacenar los datos del paciente
  const [paciente, setPaciente] = useState(null);
  // Estado para almacenar la lista de sesiones del paciente
  const [sesiones, setSesiones] = useState([]);

  // Ordena las sesiones por fecha descendente (más reciente primero)
  const ordenarPorFechaDesc = sesiones =>
    [...sesiones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Efecto para cargar los datos del paciente y sus sesiones al montar el componente o cambiar el ID
  useEffect(() => {
    // Obtiene los datos del paciente desde la API
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

    // Obtiene las sesiones del paciente desde la API
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

  // Maneja la creación de una nueva sesión y actualiza la lista de sesiones
  const handleSesionCreada = nuevaSesion => {
    setSesiones(prev => ordenarPorFechaDesc([nuevaSesion, ...prev]));
  };

  return (
    <div className="container mt-5">
      {paciente ? (
        <>
          {/* Información principal del paciente */}
          <h2>{paciente.nombre}</h2>
          <p><strong>Edad:</strong> {paciente.edad}</p>
          <p><strong>Motivo de consulta:</strong> {paciente.motivo_consulta}</p>

          {/* Formulario para agregar una nueva sesión */}
          <SesionForm pacienteId={id} onSesionCreada={handleSesionCreada} />

          {/* Listado de sesiones del paciente */}
          <h4 className="mt-5">Sesiones</h4>
          {sesiones.length === 0 ? (
            <p>No hay sesiones registradas aún.</p>
          ) : (
            sesiones.map(sesion => (
              <div key={sesion.id} className="card my-3 p-3 shadow-sm">
                <p><strong>Fecha:</strong> {sesion.fecha}</p>
                <p><strong>Duración:</strong> {sesion.duracion} min</p>
                <p><strong>Estado emocional:</strong> {sesion.estado_emocional}</p>
                <p><strong>Evaluación de sesión:</strong> {sesion.evaluacion}</p>
                <p><strong>Seguimiento de hábitos:</strong> {sesion.seguimiento_habitos}</p>
                <p><strong>Actividades:</strong> {sesion.actividades}</p>
                <p><strong>Próxima sesión:</strong> {sesion.proxima_sesion}</p>
              </div>
            ))
          )}
        </>
      ) : (
        // Mensaje de carga mientras se obtienen los datos
        <p>Cargando información del paciente...</p>
      )}
    </div>
  );
};

export default PacienteDetailPage;
