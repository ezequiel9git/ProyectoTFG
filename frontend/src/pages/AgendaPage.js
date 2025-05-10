import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const AgendaPage = () => {
  const { authTokens } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [nuevaCita, setNuevaCita] = useState({
    paciente: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  useEffect(() => {
    fetchCitas();
    fetchPacientes();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/citas/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      const eventos = response.data.map(cita => ({
        id: cita.id,
        title: cita.paciente_nombre || 'Cita',
        start: cita.fecha_inicio,
        end: cita.fecha_fin,
        extendedProps: { descripcion: cita.descripcion },
      }));

      setCitas(eventos);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/pacientes/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setPacientes(response.data);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
    }
  };

  const handleDateClick = (info) => {
    const fecha = info.dateStr;
    setNuevaCita({
      paciente: '',
      descripcion: '',
      fecha_inicio: `${fecha}T09:00`,
      fecha_fin: `${fecha}T10:00`,
    });
    setModalCreateOpen(true);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    setCitaSeleccionada({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      descripcion: event.extendedProps.descripcion || '',
    });
    setModalEditOpen(true);
  };

  const handleChangeNuevaCita = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({ ...prev, [name]: value }));
  };

  const handleCrearCita = async () => {
    try {
      await axios.post('http://localhost:8000/api/citas/', nuevaCita, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Cita creada correctamente');
      setModalCreateOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error('Error al crear la cita');
    }
  };

  const handleGuardarCambios = async () => {
    try {
      await axios.put(`http://localhost:8000/api/citas/${citaSeleccionada.id}/`, {
        descripcion: citaSeleccionada.descripcion,
        fecha_inicio: citaSeleccionada.start,
        fecha_fin: citaSeleccionada.end,
      }, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Cita actualizada correctamente');
      setModalEditOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error('Error al actualizar la cita');
    }
  };

  const handleEliminarCita = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/citas/${citaSeleccionada.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Cita eliminada');
      setModalEditOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error('Error al eliminar la cita');
    }
  };

  const modalStyles = {
    content: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '500px',
      margin: 'auto',
      inset: '100px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
    },
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
      <ToastContainer />
      <div className="container rounded shadow-lg bg-white p-4">
        <div className="d-flex align-items-center mb-4">
          <img src= "url('/PacientesLogo.png')" alt="Agenda" style={{ height: '40px', marginRight: '10px' }} />
          <h2 className="mb-0">Agenda del Terapeuta</h2>
        </div>
        <p className="text-muted mb-3">Administra tus citas programadas con facilidad.</p>

        <div className="card p-3 border-0 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={citas}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      </div>

      {/* Modales: Crear y Editar */}
      <Modal isOpen={modalCreateOpen} onRequestClose={() => setModalCreateOpen(false)} style={modalStyles}>
        <h5>Nueva Cita</h5>
        <div className="mb-2">
          <label>Paciente</label>
          <select className="form-control" name="paciente" value={nuevaCita.paciente} onChange={handleChangeNuevaCita}>
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Descripción</label>
          <textarea className="form-control" name="descripcion" value={nuevaCita.descripcion} onChange={handleChangeNuevaCita} />
        </div>
        <div className="mb-2">
          <label>Fecha inicio</label>
          <input type="datetime-local" name="fecha_inicio" className="form-control" value={nuevaCita.fecha_inicio} onChange={handleChangeNuevaCita} />
        </div>
        <div className="mb-2">
          <label>Fecha fin</label>
          <input type="datetime-local" name="fecha_fin" className="form-control" value={nuevaCita.fecha_fin} onChange={handleChangeNuevaCita} />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-success" onClick={handleCrearCita}>Crear Cita</button>
          <button className="btn btn-secondary" onClick={() => setModalCreateOpen(false)}>Cancelar</button>
        </div>
      </Modal>

      <Modal isOpen={modalEditOpen} onRequestClose={() => setModalEditOpen(false)} style={modalStyles}>
        <h5 className="mb-3">Editar Cita</h5>
        {citaSeleccionada && (
          <>
            <p><strong>Paciente:</strong> {citaSeleccionada.title}</p>
            <div className="mb-2">
              <label>Descripción</label>
              <textarea
                className="form-control"
                name="descripcion"
                value={citaSeleccionada.descripcion}
                onChange={e => setCitaSeleccionada(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>
            <div className="mb-2">
              <label>Fecha inicio</label>
              <input
                type="datetime-local"
                name="start"
                className="form-control"
                value={citaSeleccionada.start.slice(0, 16)}
                onChange={e => setCitaSeleccionada(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="mb-2">
              <label>Fecha fin</label>
              <input
                type="datetime-local"
                name="end"
                className="form-control"
                value={citaSeleccionada.end.slice(0, 16)}
                onChange={e => setCitaSeleccionada(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-success" onClick={handleGuardarCambios}>Guardar Cambios</button>
              <button className="btn btn-danger" onClick={handleEliminarCita}>Eliminar Cita</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AgendaPage;
