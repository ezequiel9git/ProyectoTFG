import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AuthContext from '../context/AuthContext';
import { Tab, Nav } from 'react-bootstrap';
import { FcStatistics, FcAlarmClock, FcBullish, FcClock, FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'; // Agrega esta importación junto a las otras de recharts


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
              <Nav.Item><Nav.Link eventKey="global">
                <img src="/LogoGráfico.png" alt="Estadísticas Globales" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Estadísticas Globales</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="tabla">
                <img src="/LogoReloj.png" alt="Sesiones por Paciente" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                      Sesiones por Paciente</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="grafico">
                <img src="/LogoGráficoCircular.png" alt="Porcentaje de prioridad" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Porcentaje de prioridad</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="prioridad">
                <img src="/LogoAlerta.png" alt="Prioridad de pacientes" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Prioridad de pacientes</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content>
              {/* GLOBAL */}
              <Tab.Pane eventKey="global">

                <div className="d-flex align-items-center mb-4">
                  <img src="/LogoGráfico.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
                  <div className="card-body text-center">
                    <h4 className="card-title text-secundary">Estadísticas Globales</h4>
                    <p className="text-muted fst-italic">Consulta estadísticas de carácter general que pueden resultar útiles para gestionar mejor tus sesiones.</p>
                  </div>
                </div>


                <div className="row mb-4">
                  {[
                    { label: "Promedio de sesiones por paciente", value: estadisticasGenerales.promedioSesionesPorPaciente, icon: <FcStatistics style={{fontSize: 32, marginBottom: 8}} />},
                    { label: "Duración total de todas las sesiones", value: `${estadisticasGenerales.duracionTotalGlobal} min`, icon: <FcAlarmClock style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Duración promedio de sesiones", value: `${estadisticasGenerales.duracionPromedioGlobal} min`, icon: <FcAlarmClock style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Cantidad total de pacientes", value: reportes.length, icon: <FcBullish style={{fontSize: 32, marginBottom: 8}} /> }, 
                    { label: "Paciente con más sesiones", value: estadisticasGenerales.pacienteConMasSesiones || "N/A", icon: <FcBusinessman style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Paciente con mayor duración total", value: estadisticasGenerales.pacienteConMayorDuracion || "N/A", icon: <FcBusinesswoman style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Sesión más larga (min)", value: Math.max(...reportes.map(r => r.duracionTotal || 0)), icon: <FcClock style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Sesión promedio más larga por paciente (min)", value: Math.max(...reportes.map(r => parseFloat(r.duracionPromedio) || 0)), icon: <FcClock style={{fontSize: 32, marginBottom: 8}} /> },
                    { label: "Sesión promedio más corta por paciente (min)", value: Math.min(...reportes.map(r => parseFloat(r.duracionPromedio) || 0)), icon: <FcClock style={{fontSize: 32, marginBottom: 8}} /> },
                  ].map((item, i) => (
                    <div className="col-md-4 mb-3" key={i}>
                      <div className="card border-0 shadow-sm rounded-3 text-center">
                        <div className="card-body">
                          <div>{item.icon}</div>
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
                  <div className="d-flex align-items-center mb-4">
                  <img src="/LogoReloj.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
                  <div className="card-body text-center">
                    <h4 className="card-title text-secundary">Tabla de distribución de sesiones por paciente</h4>
                    <p className="text-muted fst-italic">Esta tabla te ayudará a comprender mejor el tiempo acaparado de sesiones de tus pacientes.</p>
                  </div>
                </div>
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ backgroundColor: '#70041b', color: 'white' }}>Nombre del Paciente</th>
                        <th style={{ backgroundColor: '#380694', color: 'white' }}>Nº de Sesiones</th>
                        <th style={{ backgroundColor: '#380694', color: 'white' }}>Duración Total (min)</th>
                        <th style={{ backgroundColor: '#380694', color: 'white' }}>Duración Promedio (min)</th>
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

              {/* GRÁFICOS */}
              <Tab.Pane eventKey="grafico">
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-4">
                    <img src="/LogoGráficoCircular.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
                    <div className="card-body text-center">
                      <h4 className="card-title text-secundary">Gráfico de la escala de seguimiento de tus pacientes</h4>
                      <p className="text-muted fst-italic">Este gráfico muestra de forma práctica la prioridad de seguimiento de tus pacientes en porcentajes.</p>
                  </div>
                </div>
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

                {/* NUEVO GRÁFICO DE BARRAS */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-4">
                    <img src="/LogoGráfico.png" alt="Icono de barras" className="mx-auto" style={{ width: '125px', height: '125px' }} />
                    <div className="card-body text-center">
                      <h4 className="card-title text-secundary">Pacientes por Prioridad de Seguimiento</h4>
                      <p className="text-muted fst-italic">Este gráfico muestra la cantidad absoluta de pacientes en cada nivel de prioridad.</p>
                    </div>
                  </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ResponsiveContainer width={400} height={250}>
                        <BarChart
                          data={[
                            { name: 'Alta', cantidad: pacientesPorPrioridad.Alta.length },
                            { name: 'Media', cantidad: pacientesPorPrioridad.Media.length },
                            { name: 'Baja', cantidad: pacientesPorPrioridad.Baja.length },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          barCategoryGap="30%"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="cantidad">
                            <Cell key="alta" fill={COLORS[0]} /> {/* Alta: #FF6384 */}
                            <Cell key="media" fill={COLORS[1]} /> {/* Media: #FFCE56 */}
                            <Cell key="baja" fill={COLORS[2]} /> {/* Baja: #36A2EB */}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

              </Tab.Pane>

              {/* TABLA POR PRIORIDAD */}
              <Tab.Pane eventKey="prioridad">
                <div className="table-responsive">
                  <div className="d-flex align-items-center mb-4">
                  <img src="/LogoAlerta.png" alt="Icono de estadísticas" className="mx-auto" style={{ width: '125px', height: '125px' }} />
                  <div className="card-body text-center">
                    <h4 className="card-title text-secundary">Tabla de prioridad de seguimiento</h4>
                    <p className="text-muted fst-italic">Consulta de forma rápida qué pacientes requieren mayor atención en función de su prioridad de seguimiento.</p>
                  </div>
                </div>
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ backgroundColor: '#700346', color: 'white' }}>Prioridad</th>
                        <th style={{ backgroundColor: '#70041b', color: 'white' }}>Nombre del Paciente</th>
                        <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Asunto</th>
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
