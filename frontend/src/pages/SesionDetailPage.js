import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FcCalendar, FcAlarmClock, FcMindMap, FcSurvey, FcTodoList, FcCheckmark, FcIdea, FcLowPriority } from "react-icons/fc";


const SesionDetailPage = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [sesion, setSesion] = useState(null);
  const [loading, setLoading] = useState(true);

    // Formatea la fecha a "día de mes de año"
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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

  if (loading) return (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
    <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);
  if (!sesion) return <p className="text-center text-danger mt-5">No se encontró la sesión.</p>;

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'auto' }}>
      <div
        style={{
          backgroundImage: "url('/Fondo13.png')",
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

      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: "#fdfce4" }}>
               
                <div className="row mb-4 justify-content-center">
          <div className="col-12 col-md-5 mb-3 mb-md-0 d-flex justify-content-center">
            <div className="p-3 rounded-3 w-100 text-center" style={{ background: "#ffffff", border: "2px solid #fd8ed3" }}>
              <h5><FcCalendar style={{marginRight: 6}} /> Fecha de sesión:</h5>
              {formatFecha(sesion.fecha)}
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex justify-content-center">
            <div className="p-3 rounded-3 w-100 text-center" style={{ background: "#ffffff", border: "2px solid #fdc89c" }}>
              <h5><FcAlarmClock style={{marginRight: 6}} /> Duración de la sesión:</h5>
              {sesion.duracion} minutos
            </div>
          </div>
        </div>  
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #9acafa" }}>
          <h5><FcMindMap style={{marginRight: 6}} /> Estado emocional:</h5> {sesion.estado_emocional || 'N/A'}
        </div>
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #fdc89c" }}>
          <h5><FcSurvey style={{marginRight: 6}} /> Evaluación de la sesión:</h5> {sesion.evaluacion || 'N/A'}
        </div>
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #99fda9" }}>
          <h5><FcTodoList style={{marginRight: 6}} /> Seguimiento de hábitos:</h5> {sesion.seguimiento_habitos || 'N/A'}
        </div>
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #fce774" }}>
          <h5><FcCheckmark style={{marginRight: 6}} /> Actividades programadas:</h5> {sesion.actividades || 'N/A'}
        </div>
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #fc8fea" }}>
          <h5><FcIdea style={{marginRight: 6}} /> Notas para la próxima sesión:</h5> {sesion.proxima_sesion || 'N/A'}
        </div>
        <div className="mb-4 p-3 rounded-3" style={{ background: "#ffffff", border: "2px solid #5cfac5" }}>
          <h5><FcLowPriority style={{marginRight: 6}} /> Seguimiento:</h5> {sesion.seguimiento || 'N/A'}
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
