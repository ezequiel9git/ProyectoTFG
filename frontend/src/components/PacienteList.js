import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PacienteList = () => {
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

  useEffect(() => {
    fetchPacientes();
  }, []);

  return (
    <div className="mt-4">
      <h4>Lista de Pacientes</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Cargando pacientes...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Asunto</th>
                <th>Medicación</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
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
                    <td>{paciente.prioridad_seguimiento}</td>
                    <td>
                      <Link
                        to={`/pacientes/${paciente.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Ver Detalle
                      </Link>
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
