import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SesionForm = () => {
  const { authTokens } = useContext(AuthContext);

  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    paciente: '',
    evaluación: '',
    actividades: '',
    proximasesion: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Obtener lista de pacientes
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('/api/pacientes/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setPacientes(response.data);
      } catch (err) {
        setError('Error al cargar los pacientes.');
      }
    };

    fetchPacientes();
  }, [authTokens]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post('/api/sesiones/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setMensaje('Sesión registrada exitosamente.');
      setFormData({
        paciente: '',
        evaluación: '',
        actividades: '',
        proximasesion: '',
      });
    } catch (err) {
      setError('Error al registrar la sesión.');
    }
  };

  return (
    <div className="card p-4 shadow rounded-4 mt-3">
      <h4>Registrar nueva sesión</h4>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Paciente</label>
          <select
            name="paciente"
            className="form-select"
            value={formData.paciente}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Evaluación</label>
          <textarea
            name="evaluación"
            className="form-control"
            value={formData.evaluación}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Actividades</label>
          <textarea
            name="actividades"
            className="form-control"
            value={formData.actividades}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Próxima sesión</label>
          <textarea
            name="proximasesion"
            className="form-control"
            value={formData.proximasesion}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Guardar sesión
        </button>
      </form>
    </div>
  );
};

export default SesionForm;
