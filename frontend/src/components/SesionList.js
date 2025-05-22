import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FcCalendar, FcSurvey } from "react-icons/fc";


const SesionList = ({ pacienteId, onEditarSesion }) => {
  const { authTokens } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSesiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      const ordenadas = response.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setSesiones(ordenadas);
    } catch (err) {
      console.error('Error al cargar sesiones:', err);
      setError('No se pudieron cargar las sesiones.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sesión?')) {
      try {
        await axios.delete(`http://localhost:8000/api/sesiones/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setSesiones((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error al eliminar la sesión:', error);
        alert('No se pudo eliminar la sesión.');
      }
    }
  };

  useEffect(() => {
    if (pacienteId) {
      fetchSesiones();
    }
  }, [pacienteId]);

  if (loading) {
    return <p>Cargando sesiones...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (sesiones.length === 0) {
    return <p>No hay sesiones registradas.</p>;
  }

  return (
    <div className="row">
      {sesiones.map((sesion) => (
        <div key={sesion.id} className="col-md-6 mb-4">
          <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">
                <FcCalendar style={{marginRight: 6, verticalAlign: 'middle'}} />
                <strong>Fecha:</strong> {sesion.fecha}
              </h5>
              <p className="card-text">
                <FcSurvey style={{marginRight: 6, verticalAlign: 'middle'}} />
                <strong>Evaluación:</strong> {sesion.evaluacion || 'N/A'}
              </p>
              <div className="mt-4 d-flex flex-row gap-3 justify-content-center align-items-center">
                <Link to={`/sesiones/${sesion.id}`} className="btn btn-primary">
                  Consultar sesión completa
                </Link>
                <button
                  className="btn btn-sm px-4 py-2 shadow btn-editar"
                  onClick={() => onEditarSesion(sesion)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm px-4 py-2 shadow btn-eliminar"
                  onClick={() => handleEliminar(sesion.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SesionList;
