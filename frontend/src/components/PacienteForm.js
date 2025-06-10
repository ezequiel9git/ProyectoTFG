import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcBusinessman, FcCalendar, FcExpired, FcLike, FcPortraitMode, FcPhone, FcHome, FcHighPriority, FcMediumPriority, FcLowPriority } from "react-icons/fc";

/**
 * Formulario para crear o editar un paciente.
 * Permite registrar nuevos pacientes o actualizar los datos de uno existente.
 */
const PacienteForm = ({ pacienteEditado, onExito }) => {
  // Obtiene los tokens de autenticación del contexto
  const { authTokens } = useContext(AuthContext);

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    telefono: '',
    direccion: '',
    asunto: '',
    medicacion: '',
    prioridad_seguimiento: 'Media',
  });

  // Estado para mostrar mensajes de error y éxito
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Actualiza el formulario si se está editando un paciente
  useEffect(() => {
    if (pacienteEditado) {
      setFormData({ ...pacienteEditado });
    } else {
      setFormData({
        nombre: '',
        edad: '',
        telefono: '',
        direccion: '',
        asunto: '',
        medicacion: '',
        prioridad_seguimiento: 'Media',
      });
    }
  }, [pacienteEditado]);

  // Maneja los cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario (crear o editar paciente)
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const url = pacienteEditado
      ? `http://localhost:8000/api/pacientes/${pacienteEditado.id}/`
      : 'http://localhost:8000/api/pacientes/';
    const method = pacienteEditado ? 'put' : 'post';

    try {
      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess(pacienteEditado ? 'Paciente actualizado con éxito.' : 'Paciente creado con éxito.');
      if (!pacienteEditado) {
        setFormData({
          nombre: '',
          edad: '',
          telefono: '',
          direccion: '',
          asunto: '',
          medicacion: '',
          prioridad_seguimiento: 'Media',
        });
      }
      if (onExito) onExito(pacienteEditado ? 'editado' : 'creado');

    } catch (err) {
      console.error(err);
      setError('Error al guardar el paciente. Verifica los campos.');
    }
  };

  return (
    <div className="card p-4 mt-1" style={{ background: "#ffffff", border: "#ffffff" }}>
      {/* Encabezado del formulario */}
      <div className="d-flex align-items-center mb-4">
        <img src="/AgregarPacientesLogo.png" alt="Icono de agregar pacientes" className="mx-auto" style={{ width: '125px', height: '125px' }} />
        <div className="card-body text-center">
          <h4>{pacienteEditado ? 'Editar Paciente' : 'Agregar Paciente'}</h4>
          <p className="text-muted fst-italic">En este panel puedes agregar un nuevo paciente al registro.</p>
        </div>
      </div>
      
      {/* Mensajes de error y éxito */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Formulario de paciente */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <h6><FcBusinessman style={{marginRight: 6}} /> Nombre</h6>
          <input
            type="text"
            name="nombre"
            className="form-control"
            placeholder="Nombre del paciente"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <h6><FcCalendar style={{marginRight: 6}} /> Edad</h6>
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
          <h6><FcPhone style={{marginRight: 6}} /> Teléfono de contacto</h6>
          <input
            type="text"
            name="telefono"
            className="form-control"
            placeholder="Principal teléfono de contacto del paciente"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <h6><FcHome style={{marginRight: 6}} /> Dirección</h6>
          <textarea
            name="direccion"
            className="form-control"
            placeholder="Datos del domicilio"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <h6><FcPortraitMode style={{marginRight: 6}} /> Asunto</h6>
          <input
            type="text"
            name="asunto"
            className="form-control"
            placeholder="Motivantes de la consulta (depresión, trauma, crisis...)"
            value={formData.asunto}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <h6><FcLike style={{marginRight: 6}} /> Tratamiento médico</h6>
          <textarea
            name="medicacion"
            className="form-control"
            placeholder="Especifica si el paciente se medica o sigue algún tratamiento médico influyente"
            value={formData.medicacion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <h6><FcExpired style={{marginRight: 6}} /> Prioridad de seguimiento</h6>
          <select
            name="prioridad_seguimiento"
            className="form-select"
            style={{
              color:
                formData.prioridad_seguimiento === 'Alta'
                  ? '#dc3545' // rojo
                  : formData.prioridad_seguimiento === 'Media'
                  ? '#ecb716' // amarillo
                  : '#6c757d', // gris para baja
              fontWeight: 'bold',
            }}
            value={formData.prioridad_seguimiento}
            onChange={handleChange}
          >
            <option value="Alta">
              {/* Icono para Alta */}
              &#8203; {/* invisible char para evitar warning */}
              <span style={{verticalAlign: 'middle'}}><FcHighPriority style={{marginRight: 4, fontSize: 18, verticalAlign: 'middle'}} /></span>
              Alta
            </option>
            <option value="Media">
              <span style={{verticalAlign: 'middle'}}><FcMediumPriority style={{marginRight: 4, fontSize: 18, verticalAlign: 'middle'}} /></span>
              Media
            </option>
            <option value="Baja">
              <span style={{verticalAlign: 'middle'}}><FcLowPriority style={{marginRight: 4, fontSize: 18, verticalAlign: 'middle'}} /></span>
              Baja
            </option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {pacienteEditado ? 'Actualizar' : 'Guardar'}
          </button>
          {pacienteEditado && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onExito && onExito()} 
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
      {/* Contenedor para mensajes toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PacienteForm;
