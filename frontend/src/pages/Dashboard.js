import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PacienteForm from "../components/PacienteForm";
import SesionForm from "../components/SesionForm";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

const Dashboard = ({ authTokens }) => {
    const [pacientes, setPacientes] = useState([]);
    const [sesiones, setSesiones] = useState([]);
    const navigate = useNavigate();

    // Función para obtener pacientes desde la API
    const fetchPacientes = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/pacientes/", {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            setPacientes(res.data);
        } catch (err) {
            console.error("Error al obtener pacientes:", err);
        }
    };

    // Función para obtener sesiones desde la API
    const fetchSesiones = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/sesiones/", {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            setSesiones(res.data);
        } catch (err) {
            console.error("Error al obtener sesiones:", err);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchPacientes();
        fetchSesiones();
    }, []);

    // Función para agregar nuevo paciente
    const handleAddPaciente = async (paciente) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/pacientes/", paciente, {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            fetchPacientes();
        } catch (err) {
            alert("Error al agregar paciente");
        }
    };

    // Función para actualizar la lista de sesiones después de crear una nueva
    const handleAddSesion = () => {
        fetchSesiones();
    };

    // Datos para gráfico de sesiones por paciente
    const sesionesPorPaciente = pacientes.map((p) => ({
        name: p.nombre,
        sesiones: sesiones.filter((s) => s.paciente === p.id).length,
    }));

    return (
        <div className="container mt-4">
            <h2>Panel de Control</h2>

            {/* Formulario para agregar pacientes */}
            <PacienteForm onAddPaciente={handleAddPaciente} />

            {/* Formulario para agregar sesiones */}
            <SesionForm authTokens={authTokens} pacientes={pacientes} onAddSesion={handleAddSesion} />

            {/* Mostrar pacientes y sus sesiones */}
            <h4 className="mt-4">Sesiones por Paciente</h4>
            {pacientes.map((p) => (
                <div key={p.id} className="card mt-3">
                    <div className="card-body">
                        <h5>{p.nombre}</h5>
                        <ul>
                            {sesiones.filter(s => s.paciente === p.id).map(s => (
                                <li key={s.id}>{s.fecha} - {s.notas}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}

            {/* Gráfico de barras con número de sesiones por paciente */}
            <div className="mt-5">
                <h4>Resumen Gráfico</h4>
                <BarChart width={600} height={300} data={sesionesPorPaciente}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sesiones" fill="#1976d2" />
                </BarChart>
            </div>
        </div>
    );
};

export default Dashboard;
