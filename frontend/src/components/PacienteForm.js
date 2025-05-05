import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PacienteForm = ({ onPacienteCreado }) => {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    telefono: '',
    direccion: '',
    asunto: '',
    medicacion: '',
    prioridad_seguimiento: 'Media',
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
        '/api/pacientes/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Paciente creado con éxito.');
      setFormData({
        nombre: '',
        edad: '',
        telefono: '',
        direccion: '',
        asunto: '',
        medicacion: '',
        prioridad_seguimiento: 'Media',
      });

      if (onPacienteCreado) {
        onPacienteCreado(response.data);
      }
    } catch (err) {
      setError('Error al crear el paciente. Verifica los campos.');
      console.error(err);
    }
  };

  return (
    <div className="card p-4 mt-3">
      <h4>Agregar Paciente</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            className="form-control"
            value={formData.edad}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Dirección</label>
          <textarea
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <label>Asunto</label>
          <input
            type="text"
            name="asunto"
            className="form-control"
            value={formData.asunto}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Medicación</label>
          <textarea
            name="medicacion"
            className="form-control"
            value={formData.medicacion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Prioridad de seguimiento</label>
          <select
            name="prioridad_seguimiento"
            className="form-select"
            value={formData.prioridad_seguimiento}
            onChange={handleChange}
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Paciente
        </button>
      </form>
    </div>
  );
};

export default PacienteForm;
