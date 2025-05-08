import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import SesionForm from '../components/SesionForm';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const SesionesPage = () => {
  const { pacienteId } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sesionEditada, setSesionEditada] = useState(null);

  useEffect(() => {
    if (pacienteId) {
      axios
        .get(`http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        })
        .then((res) => {
          const ordenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setSesiones(ordenadas);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar sesiones:", error);
          setLoading(false);
        });
    }
  }, [pacienteId, authTokens]);

  const handleSesionCreada = (nuevaSesion) => {
    setSesiones((prev) => {
      const actualizadas = prev.filter(s => s.id !== nuevaSesion.id); // elimina si es edición
      return [nuevaSesion, ...actualizadas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    });
  };

  const handleEliminarSesion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sesión?')) {
      try {
        await axios.delete(`http://localhost:8000/api/sesiones/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setSesiones((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error al eliminar la sesión:', error);
        alert('No se pudo eliminar la sesión.');
      }
    }
  };

  const handleEditarSesion = (sesion) => {
    setSesionEditada(sesion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setSesionEditada(null);
  };

  return (
    <div className="container mt-5">
      <h2>Sesiones de Terapia</h2>
      <p className="mb-4">Registra o gestiona sesiones para uno de tus pacientes.</p>

      {pacienteId ? (
        <>
          <SesionForm
            pacienteId={pacienteId}
            onSesionCreada={handleSesionCreada}
            sesionEditada={sesionEditada}
            onFinalizarEdicion={cancelarEdicion}
          />

          <hr className="my-4" />
          <h4>Sesiones registradas</h4>

          {loading ? (
            <p>Cargando sesiones...</p>
          ) : sesiones.length === 0 ? (
            <p>No hay sesiones registradas.</p>
          ) : (
            <ul className="list-group">
              {sesiones.map((sesion) => (
                <li key={sesion.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Fecha:</strong> {sesion.fecha}<br />
                      <strong>Duración:</strong> {sesion.duracion} min<br />
                      <strong>Evaluación:</strong> {sesion.evaluacion || 'N/A'}<br />
                      <strong>Seguimiento:</strong> {sesion.seguimiento || 'N/A'}
                    </div>
                    <div>
                    <Link to={`/sesiones/${sesion.id}`} className="btn btn-sm btn-outline-info me-2">
                      Ver detalles
                    </Link>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditarSesion(sesion)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarSesion(sesion.id)}>
                        Eliminar
                      </button>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="alert alert-warning">No se pudo encontrar el ID del paciente.</div>
      )}
    </div>
  );
};

export default SesionesPage;
