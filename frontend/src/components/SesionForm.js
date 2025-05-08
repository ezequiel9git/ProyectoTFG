import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SesionForm = ({ pacienteId, onSesionCreada }) => {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fecha: '',
    duracion: '',
    estado_emocional: '',
    evaluacion: '',
    seguimiento_habitos: '',
    actividades: '',
    proxima_sesion: '',
  });

  const [error, setError] = useState(null);

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

    try {
      const response = await axios.post(
        `http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Sesión creada con éxito 🎉');

      setFormData({
        fecha: '',
        duracion: '',
        estado_emocional: '',
        evaluacion: '',
        seguimiento_habitos: '',
        actividades: '',
        proxima_sesion: '',
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
    <div className="card p-4 mt-4">
      <h4>Registrar nueva sesión</h4>
      {error && <div className="alert alert-danger">{error}</div>}

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
          <label>Estado emocional</label>
          <textarea
            name="estado_emocional"
            className="form-control"
            value={formData.estado_emocional}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Evaluación de sesión</label>
          <textarea
            name="evaluacion"
            className="form-control"
            value={formData.evaluacion}
            onChange={handleChange}
          />
        </div>        
        <div className="mb-2">
          <label>Seguimiento de hábitos</label>
          <textarea
            name="seguimiento_habitos"
            className="form-control"
            value={formData.seguimiento_habitos}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Actividades</label>
          <textarea
            name="actividades"
            className="form-control"
            value={formData.actividades}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Próxima sesión</label>
          <textarea
            name="proxima_sesion"
            className="form-control"
            value={formData.proxima_sesion}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Sesión
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SesionForm;
