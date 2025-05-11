import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import SesionForm from '../components/SesionForm';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const SesionesPage = () => {
  const { pacienteId } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sesionEditada, setSesionEditada] = useState(null);
  const [activeTab, setActiveTab] = useState('formulario');

  useEffect(() => {
    if (pacienteId) {
      axios
        .get(`http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        })
        .then((res) => {
          const ordenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setSesiones(ordenadas);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar sesiones:", error);
          setLoading(false);
        });
    }
  }, [pacienteId, authTokens]);

  const handleSesionCreada = (nuevaSesion) => {
    setSesiones((prev) => {
      const actualizadas = prev.filter(s => s.id !== nuevaSesion.id);
      return [nuevaSesion, ...actualizadas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    });
    setSesionEditada(null);
    setActiveTab('lista');
  };

  const handleEliminarSesion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sesión?')) {
      try {
        await axios.delete(`http://localhost:8000/api/sesiones/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setSesiones((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error al eliminar la sesión:', error);
        alert('No se pudo eliminar la sesión.');
      }
    }
  };

  const handleEditarSesion = (sesion) => {
    setSesionEditada(sesion);
    setActiveTab('formulario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setSesionEditada(null);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      <div
        style={{
          backgroundImage: "url('/Fondo1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }} 
      /> 
      <div className="card p-1 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      
      
      <div className="d-flex align-items-center mb-1">
        <img src="/ListaSesionesLogo.png" alt="Icono de sesiones" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Archivo de sesiones</h2><br></br>
            <p className="text-muted fst-italic">Consulta los informes de evaluación del paciente y crea nuevos.</p>
          </div>
      </div>


      <div>
          <ul className="nav nav-tabs mb-4 justify-content-center">

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'lista' ? 'active' : ''}`}
                onClick={() => setActiveTab('lista')}
              >
                <img src="/ListaSesionesLogo.png" alt="Icono Lista" style={{ width: '20px', marginRight: '8px' }} />
                Lista de sesiones
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'formulario' ? 'active' : ''}`}
                onClick={() => setActiveTab('formulario')}
              >
                <img src="/AgregarSesionesLogo.png" alt="Icono Formulario" style={{ width: '20px', marginRight: '8px' }} />
                Registrar sesión
              </button>
            </li>

          </ul>

          {pacienteId ? (
            <>

              {activeTab === 'lista' && (
                <>
                  {loading ? (
                    <p>Cargando sesiones...</p>
                  ) : sesiones.length === 0 ? (
                    <p>No hay sesiones registradas.</p>
                  ) : (
                    <ul className="list-group">
                      {sesiones.map((sesion) => (
                        <li key={sesion.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="mb-3">
                                <h5>Fecha:</h5> {sesion.fecha}
                              </div>
                              <div className="mb-3">
                                <h5>Evaluación de la sesión:</h5> {sesion.evaluacion || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <Link
                                to={`/sesiones/${sesion.id}`}
                                className="btn btn-sm btn-outline-info me-2"
                              >
                                Ver detalles
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditarSesion(sesion)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminarSesion(sesion.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {activeTab === 'formulario' && (
                <SesionForm
                  pacienteId={pacienteId}
                  onSesionCreada={handleSesionCreada}
                  sesionEditada={sesionEditada}
                  onFinalizarEdicion={cancelarEdicion}
                />
              )}



            </>
          ) : (
            <div className="alert alert-warning text-center">
              No se pudo encontrar el ID del paciente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SesionesPage;
