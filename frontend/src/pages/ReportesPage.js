import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AuthContext from '../context/AuthContext';
import { Tab, Nav } from 'react-bootstrap';

const COLORS = ['#FF6384', '#FFCE56', '#36A2EB'];

const ReportesPage = () => {
  const { authTokens } = useContext(AuthContext);
  const [reportes, setReportes] = useState([]);
  const [pacientesPorPrioridad, setPacientesPorPrioridad] = useState({ Alta: [], Media: [], Baja: [] });
  const [loading, setLoading] = useState(true);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    promedioSesionesPorPaciente: 0,
    duracionTotalGlobal: 0,
    duracionPromedioGlobal: 0,
    pacienteConMasSesiones: '',
    pacienteConMayorDuracion: '',
    distribucionPrioridad: { Alta: 0, Media: 0, Baja: 0 },
  });

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const pacientesRes = await axios.get('http://localhost:8000/api/pacientes/', {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });

        const pacientes = pacientesRes.data;
        const prioridadAgrupada = { Alta: [], Media: [], Baja: [] };

        pacientes.forEach((paciente) => {
          const prioridad = paciente.prioridad_seguimiento;
          if (prioridadAgrupada[prioridad]) {
            prioridadAgrupada[prioridad].push({
              nombre: paciente.nombre,
              asunto: paciente.asunto || 'Sin especificar',
            });
          }
        });

        setPacientesPorPrioridad(prioridadAgrupada);

        let totalDuracionGlobal = 0;
        let totalSesionesGlobal = 0;
        let maxSesiones = -1;
        let maxDuracion = -1;
        let pacienteMaxSesiones = '';
        let pacienteMaxDuracion = '';

        const dataConEstadisticas = await Promise.all(
          pacientes.map(async (paciente) => {
            const sesionesRes = await axios.get(
              `http://localhost:8000/api/pacientes/${paciente.id}/sesiones/`,
              {
                headers: { Authorization: `Bearer ${authTokens.access}` },
              }
            );

            const sesiones = sesionesRes.data;
            const totalSesiones = sesiones.length;
            const duracionTotal = sesiones.reduce((acc, sesion) => acc + (sesion.duracion || 0), 0);
            const duracionPromedio = totalSesiones > 0 ? (duracionTotal / totalSesiones).toFixed(1) : 0;

            totalDuracionGlobal += duracionTotal;
            totalSesionesGlobal += totalSesiones;

            if (totalSesiones > maxSesiones) {
              maxSesiones = totalSesiones;
              pacienteMaxSesiones = paciente.nombre;
            }

            if (duracionTotal > maxDuracion) {
              maxDuracion = duracionTotal;
              pacienteMaxDuracion = paciente.nombre;
            }

            return {
              nombre: paciente.nombre,
              totalSesiones,
              duracionTotal,
              duracionPromedio,
            };
          })
        );

        const promedioSesionesPorPaciente = pacientes.length > 0
          ? (totalSesionesGlobal / pacientes.length).toFixed(1)
          : 0;

        const duracionPromedioGlobal = totalSesionesGlobal > 0
          ? (totalDuracionGlobal / totalSesionesGlobal).toFixed(1)
          : 0;

        const distribucionPrioridad = {
          Alta: ((prioridadAgrupada.Alta.length / pacientes.length) * 100).toFixed(1),
          Media: ((prioridadAgrupada.Media.length / pacientes.length) * 100).toFixed(1),
          Baja: ((prioridadAgrupada.Baja.length / pacientes.length) * 100).toFixed(1),
        };

        setEstadisticasGenerales({
          promedioSesionesPorPaciente,
          duracionTotalGlobal: totalDuracionGlobal,
          duracionPromedioGlobal,
          pacienteConMasSesiones: pacienteMaxSesiones,
          pacienteConMayorDuracion: pacienteMaxDuracion,
          distribucionPrioridad,
        });

        setReportes(dataConEstadisticas);
      } catch (error) {
        console.error('Error al cargar los reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [authTokens]);

  const prioridadData = [
    { name: 'Alta', value: parseFloat(estadisticasGenerales.distribucionPrioridad.Alta) },
    { name: 'Media', value: parseFloat(estadisticasGenerales.distribucionPrioridad.Media) },
    { name: 'Baja', value: parseFloat(estadisticasGenerales.distribucionPrioridad.Baja) },
  ];

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
      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="d-flex align-items-center mb-4">
          <img src="/LogoReportes.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div className="card-body text-center">
            <h2 className="card-title text-primary">Estadísticas</h2>
            <p className="text-muted fst-italic">Consulta estadísticas que pueden resultarte útiles para planificar tu trabajo.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Cargando reportes...</p>
        ) : (
          <Tab.Container defaultActiveKey="global">
            <Nav variant="tabs" className="mb-4 justify-content-center">
              <Nav.Item><Nav.Link eventKey="global">Estadísticas Globales</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="tabla">Sesiones por Paciente</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="grafico">Porcentaje de prioridad</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="prioridad">Prioridad de pacientes</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content>
              {/* GLOBAL */}
              <Tab.Pane eventKey="global">
                <div className="row mb-4">
                  {[
                    { label: "Promedio de sesiones por paciente", value: estadisticasGenerales.promedioSesionesPorPaciente },
                    { label: "Duración total de todas las sesiones", value: `${estadisticasGenerales.duracionTotalGlobal} min` },
                    { label: "Duración promedio de sesiones", value: `${estadisticasGenerales.duracionPromedioGlobal} min` },
                    { label: "Paciente con más sesiones", value: estadisticasGenerales.pacienteConMasSesiones || "N/A" },
                    { label: "Paciente con mayor duración total", value: estadisticasGenerales.pacienteConMayorDuracion || "N/A" },
                  ].map((item, i) => (
                    <div className="col-md-4 mb-3" key={i}>
                      <div className="card border-0 shadow-sm rounded-3 text-center">
                        <div className="card-body">
                          <h6 className="text-muted">{item.label}</h6>
                          <h4 className="text-primary">{item.value}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Pane>

              {/* POR PACIENTE */}
              <Tab.Pane eventKey="tabla">
                <div className="table-responsive mb-4">
                  <h5 className="text-center mb-3">Resumen de sesiones por paciente</h5>
                  <table className="table table-bordered table-hover">
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
                        <tr><td colSpan="4" className="text-center">No hay datos disponibles.</td></tr>
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
              </Tab.Pane>

              {/* GRÁFICO */}
              <Tab.Pane eventKey="grafico">
                <div className="mb-4">
                  <h5 className="text-center mb-3">Distribución de pacientes por prioridad</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prioridadData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {prioridadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Tab.Pane>

              {/* TABLA POR PRIORIDAD */}
              <Tab.Pane eventKey="prioridad">
                <div className="table-responsive">
                  <h5 className="text-center mb-3">Pacientes agrupados por prioridad de seguimiento</h5>
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Prioridad</th>
                        <th>Nombre del Paciente</th>
                        <th>Asunto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Alta", "Media", "Baja"].map((nivel) =>
                        pacientesPorPrioridad[nivel].length === 0 ? (
                          <tr key={nivel}>
                            <td>{nivel}</td>
                            <td colSpan="2" className="text-center">Sin pacientes</td>
                          </tr>
                        ) : (
                          pacientesPorPrioridad[nivel].map((p, index) => (
                            <tr key={`${nivel}-${index}`}>
                              <td>{nivel}</td>
                              <td>{p.nombre}</td>
                              <td>{p.asunto}</td>
                            </tr>
                          ))
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;
