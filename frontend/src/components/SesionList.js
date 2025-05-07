import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SesionList = ({ pacienteId }) => {
  const { authTokens } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSesiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/pacientes/${pacienteId}/sesiones/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setSesiones(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las sesiones.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSesiones();
  }, [pacienteId]);

  return (
    <div className="mt-4">
      <h4>Lista de Sesiones</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando sesiones...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Duración (min)</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {sesiones.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay sesiones registradas.
                  </td>
                </tr>
              ) : (
                sesiones.map(sesion => (
                  <tr key={sesion.id}>
                    <td>{sesion.fecha}</td>
                    <td>{sesion.duracion}</td>
                    <td>{sesion.notas || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SesionList;
