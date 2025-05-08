import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SesionForm = ({ pacienteId, onSesionCreada, sesionEditada, onFinalizarEdicion }) => {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fecha: '',
    duracion: '',
    estado_emocional: '',
    evaluacion: '',
    seguimiento_habitos: '',
    actividades: '',
    proxima_sesion: '',
    seguimiento: '',
  });

  useEffect(() => {
    if (sesionEditada) {
      setFormData(sesionEditada);
    }
  }, [sesionEditada]);

  const [error, setError] = useState(null);
  const modoEdicion = Boolean(sesionEditada);

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

    const url = modoEdicion
      ? `http://localhost:8000/api/sesiones/${sesionEditada.id}/`
      : `http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`;

    const method = modoEdicion ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success(modoEdicion ? 'Sesión actualizada ✅' : 'Sesión creada 🎉');

      setFormData({
        fecha: '',
        duracion: '',
        estado_emocional: '',
        evaluacion: '',
        seguimiento_habitos: '',
        actividades: '',
        proxima_sesion: '',
        seguimiento: '',
      });

      if (onSesionCreada) onSesionCreada(response.data);
      if (modoEdicion && onFinalizarEdicion) onFinalizarEdicion();

    } catch (err) {
      setError('Error al guardar la sesión. Verifica los campos.');
      console.error(err);
    }
  };

  return (
    <div className="card p-4 mt-4">
      <h4>{modoEdicion ? 'Editar sesión' : 'Registrar nueva sesión'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Fecha</label>
          <input type="date" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label>Duración (minutos)</label>
          <input type="number" name="duracion" className="form-control" value={formData.duracion} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label>Estado emocional</label>
          <textarea name="estado_emocional" className="form-control" value={formData.estado_emocional} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Evaluación de sesión</label>
          <textarea name="evaluacion" className="form-control" value={formData.evaluacion} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Seguimiento de hábitos</label>
          <textarea name="seguimiento_habitos" className="form-control" value={formData.seguimiento_habitos} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Actividades</label>
          <textarea name="actividades" className="form-control" value={formData.actividades} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Próxima sesión</label>
          <textarea name="proxima_sesion" className="form-control" value={formData.proxima_sesion} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Seguimiento</label>
          <input type="text" name="seguimiento" className="form-control" value={formData.seguimiento} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">
          {modoEdicion ? 'Actualizar' : 'Guardar Sesión'}
        </button>

        {modoEdicion && (
          <button type="button" className="btn btn-secondary ms-2" onClick={onFinalizarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SesionForm;
