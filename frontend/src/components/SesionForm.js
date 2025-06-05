import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcCalendar, FcAlarmClock, FcMindMap, FcIdea, FcTodoList, FcCheckmark, FcSurvey, FcLowPriority } from "react-icons/fc";


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

      // El toast se muestra en el padre, así que aquí solo avisamos
      if (onSesionCreada) onSesionCreada(modoEdicion ? 'editada' : 'creada');
      if (modoEdicion && onFinalizarEdicion) onFinalizarEdicion();

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

    } catch (err) {
      setError('Error al guardar la sesión. Verifica los campos.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
 
  return (
     <div className="card p-4 mt-1" style={{ background: "#ffffff", border: "2px solid #fdc89c" }}>
      <div className="d-flex align-items-center mb-4">
        <img src="/AgregarSesionesLogo.png" alt="Icono de agregar sesiones" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div className="card-body text-center">
            <h4>{modoEdicion ? 'Editar sesión' : 'Registrar nueva sesión'}</h4>
            <p className="text-muted fst-italic">En este panel puedes agregar una nueva sesión para el paciente seleccionado.</p>
          </div>
        </div>  
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h6><FcCalendar style={{marginRight: 6}} /> Fecha</h6>          
          <input type="date" name="fecha" className="form-control" value={formData.fecha} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <h6><FcAlarmClock style={{marginRight: 6}} /> Duración (minutos)</h6>
          <input type="number" name="duracion" className="form-control" value={formData.duracion} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <h6><FcMindMap style={{marginRight: 6}} /> Estado emocional</h6>
          <textarea name="estado_emocional" className="form-control" placeholder="Estados de ánimo tanto general como en momentos puntuales de la sesión" value={formData.estado_emocional} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <h6><FcSurvey style={{marginRight: 6}} /> Evaluación de sesión</h6>
          <textarea name="evaluacion" className="form-control" placeholder="Descripción, resumen, conclusiones, ideas clave de la sesión" value={formData.evaluacion} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <h6><FcTodoList style={{marginRight: 6}} /> Seguimiento de hábitos</h6>
          <textarea name="seguimiento_habitos" className="form-control" placeholder="Seguimiento de sus rutinas (sueño, apetito...) " value={formData.seguimiento_habitos} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <h6><FcCheckmark style={{marginRight: 6}} /> Actividades asignadas</h6>
          <textarea name="actividades" className="form-control" placeholder="Seguimiento de las tareas asignadas al paciente" value={formData.actividades} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <h6><FcIdea style={{marginRight: 6}} /> Notas para la próxima sesión</h6>
          <textarea name="proxima_sesion" className="form-control" placeholder="Apuntes a considerar para el próximo encuentro" value={formData.proxima_sesion} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <h6><FcLowPriority style={{marginRight: 6}} /> Prioridad de Seguimiento</h6>
          <input type="text" name="seguimiento" className="form-control" placeholder="Evaluación de modificaciones en la prioridad de seguimiento" value={formData.seguimiento} onChange={handleChange} />
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
