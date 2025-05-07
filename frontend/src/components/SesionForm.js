import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SesionForm = ({ pacienteId, onSesionCreada }) => {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fecha: '',
    notas: '',
    duracion: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `/api/pacientes/${pacienteId}/sesiones/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Sesión creada con éxito.');
      setFormData({
        fecha: '',
        notas: '',
        duracion: '',
      });

      if (onSesionCreada) {
        onSesionCreada(response.data);
      }
    } catch (err) {
      setError('Error al crear la sesión. Verifica los campos.');
      console.error(err);
    }
  };

  return (
    <div className="card p-4 mt-3">
      <h4>Agregar Sesión</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            className="form-control"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Duración (minutos)</label>
          <input
            type="number"
            name="duracion"
            className="form-control"
            value={formData.duracion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Notas</label>
          <textarea
            name="notas"
            className="form-control"
            value={formData.notas}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Sesión
        </button>
      </form>
    </div>
  );
};

export default SesionForm;
