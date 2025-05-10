import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PacienteForm = ({ pacienteEditado, onExito }) => {
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
      if (onExito) onExito();

    } catch (err) {
      console.error(err);
      setError('Error al guardar el paciente. Verifica los campos.');
    }
  };

  return (
    <div className="card p-4 mt-1">
      <div className="d-flex align-items-center mb-4">
        <img src="/AgregarPacientesLogo.png" alt="Icono de agregar pacientes" className="mx-auto" style={{ width: '153px', height: '102px' }} />
          <div className="card-body">
            <p style={{ fontStyle: "italic", textAlign: "center" }}>En este panel puedes agregar un nuevo paciente al registro.</p>
          </div>
        </div>  
      <h4>{pacienteEditado ? 'Editar Paciente' : 'Agregar Paciente'}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <h6>Nombre</h6>
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
          <h6>Edad</h6>
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
          <h6>Teléfono de contacto</h6>
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
          <h6>Dirección</h6>
          <textarea
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-2">
          <h6>Asunto</h6>
          <input
            type="text"
            name="asunto"
            className="form-control"
            value={formData.asunto}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <h6>Tratamiento médico</h6>
          <textarea
            name="medicacion"
            className="form-control"
            value={formData.medicacion}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <h6>Prioridad de seguimiento</h6>
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
    </div>
  );
};

export default PacienteForm;
