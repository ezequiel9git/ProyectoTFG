import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PacienteDetailPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);

  const [paciente, setPaciente] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [nuevaSesion, setNuevaSesion] = useState({
    fecha: '',
    notas: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  const fetchPaciente = async () => {
    try {
      const response = await axios.get(`${API_URL}/pacientes/${id}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setPaciente(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos del paciente.');
    }
  };

  const fetchSesiones = async () => {
    try {
      const response = await axios.get(`${API_URL}/pacientes/${id}/sesiones/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setSesiones(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar sesiones.');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNuevaSesion(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearSesion = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        `${API_URL}/pacientes/${id}/sesiones/`,
        { ...nuevaSesion },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Sesión creada con éxito.');
      setNuevaSesion({ fecha: '', notas: '' });
      fetchSesiones();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setError('Error al crear la sesión.');
      setTimeout(() => setError(null), 4000);
    }
  };

  useEffect(() => {
    fetchPaciente();
    fetchSesiones();
    // eslint-disable-next-line
  }, [id]);

  if (!paciente) return <p className="mt-4">Cargando datos del paciente...</p>;

  return (
    <div className="container mt-4">
      <h3>Detalle del Paciente</h3>
      <div className="card p-3 mb-4">
        <h5>{paciente.nombre}</h5>
        <p><strong>Edad:</strong> {paciente.edad}</p>
        <p><strong>Teléfono:</strong> {paciente.telefono}</p>
        <p><strong>Dirección:</strong> {paciente.direccion}</p>
        <p><strong>Asunto:</strong> {paciente.asunto || '-'}</p>
        <p><strong>Medicación:</strong> {paciente.medicacion || '-'}</p>
        <p><strong>Prioridad:</strong> {paciente.prioridad_seguimiento}</p>
      </div>

      <h4>Sesiones</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleCrearSesion} className="mb-4">
        <div className="mb-2">
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={nuevaSesion.fecha}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Notas</label>
          <textarea
            name="notas"
            className="form-control"
            value={nuevaSesion.notas}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Sesión</button>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center">No hay sesiones registradas.</td>
              </tr>
            ) : (
              sesiones.map(sesion => (
                <tr key={sesion.id}>
                  <td>{sesion.fecha}</td>
                  <td>{sesion.notas || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PacienteDetailPage;
