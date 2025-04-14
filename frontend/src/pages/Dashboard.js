import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/pacientes/", {
                    headers: { Authorization: `Bearer ${authTokens.access}` },
                });
                setPacientes(response.data);
            } catch (error) {
                console.error("Error obteniendo pacientes:", error);
            }
        };

        fetchPacientes();
    }, [authTokens]);

    return (
        <div className="container mt-5">
            <h2>Lista de Pacientes</h2>
            <button className="btn btn-danger" onClick={logoutUser}>Cerrar Sesión</button>
            <ul className="list-group mt-3">
                {pacientes.map((paciente) => (
                    <li key={paciente.id} className="list-group-item">
                        {paciente.nombre} - {paciente.edad} años
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
