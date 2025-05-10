import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const ReportesPage = () => {
  const { authTokens } = useContext(AuthContext);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const pacientesRes = await axios.get('http://localhost:8000/api/pacientes/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });

        const pacientes = pacientesRes.data;
        const dataConEstadisticas = await Promise.all(
          pacientes.map(async (paciente) => {
            const sesionesRes = await axios.get(`http://localhost:8000/api/pacientes/${paciente.id}/sesiones/`, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            });

            const sesiones = sesionesRes.data;
            const totalSesiones = sesiones.length;
            const duracionTotal = sesiones.reduce((acc, sesion) => acc + (sesion.duracion || 0), 0);
            const duracionPromedio = totalSesiones > 0 ? (duracionTotal / totalSesiones).toFixed(1) : 0;

            return {
              nombre: paciente.nombre,
              totalSesiones,
              duracionTotal,
              duracionPromedio,
            };
          })
        );

        setReportes(dataConEstadisticas);
      } catch (error) {
        console.error('Error al cargar los reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [authTokens]);

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
        <img src="/LogoReportes.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div className="card-body">
            <p style={{ fontStyle: "italic", textAlign: "center" }}>Aquí puedes consultar estadísticas útiles.</p>
          </div>
      </div>

        {loading ? (
          <p>Cargando reportes...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Nombre del Paciente</th>
                  <th>Nº de Sesiones</th>
                  <th>Duración Total (min)</th>
                  <th>Duración Promedio (min)</th>
                </tr>
              </thead>
              <tbody>
                {reportes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No hay datos disponibles.</td>
                  </tr>
                ) : (
                  reportes.map((r, index) => (
                    <tr key={index}>
                      <td>{r.nombre}</td>
                      <td>{r.totalSesiones}</td>
                      <td>{r.duracionTotal}</td>
                      <td>{r.duracionPromedio}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;
