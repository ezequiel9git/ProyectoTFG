import { useState, useEffect } from "react";
import axios from "axios";

const SesionForm = ({ authTokens, pacientes, onAddSesion }) => {
    const [pacienteId, setPacienteId] = useState("");
    const [fecha, setFecha] = useState("");
    const [notas, setNotas] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sesion = { paciente: pacienteId, fecha, notas };
        try {
            await axios.post("http://127.0.0.1:8000/api/sesiones/", sesion, {
                headers: { Authorization: `Bearer ${authTokens.access}` },
            });
            onAddSesion();
            setPacienteId("");
            setFecha("");
            setNotas("");
        } catch (error) {
            console.error("Error al crear sesión:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <select value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} className="form-control mb-2">
                <option value="">Selecciona un paciente</option>
                {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
            </select>
            <input
                type="date"
                className="form-control mb-2"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />
            <textarea
                className="form-control mb-2"
                placeholder="Notas de la sesión"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
            />
            <button type="submit" className="btn btn-success">Agregar Sesión</button>
        </form>
    );
};

export default SesionForm;
