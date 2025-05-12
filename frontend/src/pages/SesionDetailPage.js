import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SesionDetailPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/sesiones/${id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((res) => {
        setSesion(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar detalles de la sesión:', err);
        setLoading(false);
      });
  }, [id, authTokens]);

  if (loading) return <p className="text-center mt-5">Cargando detalles de la sesión...</p>;

  if (!sesion) return <p className="text-center text-danger mt-5">No se encontró la sesión.</p>;

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
      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <div className="d-flex align-items-center mb-4">
        <img src="/ListaSesionesLogo.png" alt="Icono de sesiones" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div style={{ textAlign: "center" }} className="card-body">
            <h2 className="card-title text-primary">Informe de sesión</h2><br></br>
            <p className="text-muted fst-italic">Consulta el informe de evaluación completo del paciente.</p>
          </div>
      </div>

      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="mb-3">
          <h5>Fecha:</h5> {sesion.fecha}
        </div>
        <div className="mb-3">
          <h5>Duración:</h5> {sesion.duracion} minutos
        </div>
        <div className="mb-3">
          <h5>Estado emocional</h5> {sesion.estado_emocional || 'N/A'}
        </div>
        <div className="mb-3">
          <h5>Evaluación de la sesión:</h5> {sesion.evaluacion || 'N/A'}
        </div>
        <div className="mb-3">
          <h5>Seguimiento de hábitos:</h5> {sesion.seguimiento_habitos || 'N/A'}
        </div>
        <div className="mb-3">
          <h5>Actividades programadas:</h5> {sesion.actividades || 'N/A'}
        </div>
        <div className="mb-3">
          <h5>Notas para la próxima sesión:</h5> {sesion.proxima_sesion || 'N/A'}
        </div>
        <div className="mb-3">
          <h5>Seguimiento:</h5> {sesion.seguimiento || 'N/A'}
        </div>

        <div className="text-end">
          <Link to={`/pacientes/${sesion.paciente}/sesiones`} className="btn btn-primary">
            ← Volver a sesiones del paciente
          </Link>
        </div>
      </div>
    </div></div>
  );
};

export default SesionDetailPage;
