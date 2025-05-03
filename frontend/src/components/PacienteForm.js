import { useState } from "react";

const PacienteForm = ({ onAddPaciente }) => {
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [asunto, setAsunto] = useState("");
    const [medicacion, setMedicacion] = useState("");
    const [prioridad, setPrioridad] = useState("Media");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddPaciente({ nombre, edad, telefono, direccion, asunto, medicacion, prioridad_seguimiento: prioridad });
        
        setNombre(""); setEdad(""); setTelefono(""); setDireccion("");
        setAsunto(""); setMedicacion(""); setPrioridad("Media");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <input className="form-control mb-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input className="form-control mb-2" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
            <input className="form-control mb-2" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <textarea className="form-control mb-2" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            <input className="form-control mb-2" placeholder="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} />
            <textarea className="form-control mb-2" placeholder="Medicación" value={medicacion} onChange={(e) => setMedicacion(e.target.value)} />
            <select className="form-control mb-2" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
            </select>
            
            <button type="submit" className="btn btn-success">Agregar Paciente</button>
        </form>
    );
};

export default PacienteForm;