import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PacienteList = ({ onEditarPaciente, recargarTrigger }) => {
  const { authTokens } = useContext(AuthContext);
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/pacientes/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setPacientes(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar pacientes.');
    }
    setLoading(false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await axios.delete(`http://localhost:8000/api/pacientes/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setPacientes(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
        alert('Error al eliminar el paciente.');
      }
    }
  };

  const renderPrioridad = (prioridad) => {
    const color =
      prioridad === 'Alta' ? 'danger' :
      prioridad === 'Media' ? 'warning' :
      'secondary';
    return <span className={`badge bg-${color} rounded-pill`}>{prioridad}</span>;
  };

  useEffect(() => {
    fetchPacientes();
  }, [recargarTrigger]);

  return (
    <div className="mt-1">
      <div className="d-flex align-items-center mb-4">
        <img src="/LogoPacientes.png" alt="Pacientes" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div className="card-body">
            <p style={{ fontStyle: "italic", textAlign: "center" }}>Aquí se muestran todos los pacientes que tienes registrados.</p>
            <p style={{ fontStyle: "italic", textAlign: "center" }}>Desde este panel, podrás gestionar los registros y acceder a su informe de sesiones.</p>
          </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando pacientes...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered shadow-sm rounded">
            <thead className="table-light" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
              <tr>
                <th style={{ backgroundColor: '#70041b', color: 'white' }}>Nombre</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Edad</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Teléfono</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Dirección</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Asunto</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Medicación</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Prioridad</th>
                <th style={{ backgroundColor: '#700346', color: 'white' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No hay pacientes registrados.
                  </td>
                </tr>
              ) : (
                pacientes.map(paciente => (
                  <tr key={paciente.id}>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.edad}</td>
                    <td>{paciente.telefono}</td>
                    <td>{paciente.direccion}</td>
                    <td>{paciente.asunto || '-'}</td>
                    <td>{paciente.medicacion || '-'}</td>
                    <td>{renderPrioridad(paciente.prioridad_seguimiento)}</td>
                    <td className="d-flex flex-wrap gap-2">
                      <Link
                        to={`/pacientes/${paciente.id}/sesiones`}
                        className="btn btn-sm rounded-pill px-3 shadow btn-agregar"
                      > Gestionar sesiones
                      </Link>
                      <button
                        className="btn btn-sm rounded-pill px-3 shadow btn-editar"
                        onClick={() => onEditarPaciente(paciente)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm rounded-pill px-3 shadow btn-eliminar"
                        onClick={() => handleEliminar(paciente.id)}
                      >
                        Borrar
                      </button>

                    </td>
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

export default PacienteList;
