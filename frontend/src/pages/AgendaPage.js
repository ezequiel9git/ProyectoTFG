import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';
import Modal from 'react-modal';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CitaFormModal from '../components/CitaFormModal';
import CitaEditModal from '../components/CitaEditModal';

// Configura el elemento raíz para los modales de React
Modal.setAppElement('#root');

const AgendaPage = () => {
  // Obtiene el token de autenticación del contexto
  const { authTokens } = useContext(AuthContext);

  // Estado para almacenar las citas del calendario
  const [citas, setCitas] = useState([]);
  // Estado para la lista de pacientes (para seleccionar en el formulario)
  const [pacientes, setPacientes] = useState([]);
  // Estado para controlar la visibilidad del modal de edición
  const [modalEditOpen, setModalEditOpen] = useState(false);
  // Estado para controlar la visibilidad del modal de creación
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  // Estado para la cita seleccionada (al editar)
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  
  // Estado para la fecha seleccionada al crear cita
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  // Carga inicial de citas y pacientes al montar el componente
  useEffect(() => {
    fetchCitas();
    fetchPacientes();
  }, []);

  // Obtiene las citas desde la API y las adapta para FullCalendar
  const fetchCitas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/citas/', {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      // Mapea las citas para el formato de FullCalendar
      const eventos = response.data.map(cita => ({
        id: cita.id,
        title: cita.paciente_nombre || 'Cita',
        start: cita.fecha_inicio,
        end: cita.fecha_fin,
        extendedProps: { 
          descripcion: cita.descripcion,
          paciente: cita.paciente // <-- Añade esto
        },
      }));

      setCitas(eventos);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  };

  // Obtiene la lista de pacientes para el selector del formulario
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

  // Maneja el clic en una fecha vacía del calendario para crear una cita
  const handleDateClick = (info) => {
    setFechaSeleccionada(info.dateStr);
    setModalCreateOpen(true);
  };

  // Maneja el clic en un evento existente para editarlo
  const handleEventClick = (info) => {
    const event = info.event;
    setCitaSeleccionada({
      id: event.id,
      paciente: event.extendedProps.paciente || '', // Asegúrate de que el paciente esté en extendedProps
      fecha_inicio: event.startStr,
      fecha_fin: event.endStr,
      descripcion: event.extendedProps.descripcion || '',
      title: event.title,
    });
    setModalEditOpen(true);
  };

  
  // Envía la solicitud para crear una nueva cita
  const handleCrearCita = async (formData) => {
    try {
      await axios.post('http://localhost:8000/api/citas/', formData, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Cita creada correctamente');
      setModalCreateOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error('Error al crear la cita');
    }
  };

  // Guarda los cambios realizados en una cita existente
  const handleGuardarCambios = async (formData) => {
    try {
      await axios.put(`http://localhost:8000/api/citas/${citaSeleccionada.id}/`, formData, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      toast.success('Cita actualizada correctamente');
      setModalEditOpen(false);
      fetchCitas();
    } catch (error) {
      toast.error('Error al actualizar la cita');
    }
  };

  // Elimina la cita seleccionada
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

  // Estilos personalizados para los modales
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
      {/* Fondo decorativo */}
      <div
        style={{
          backgroundImage: "url('/Fondo14.png')",
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
      <div className="card p-4 shadow rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: "2px solid #9acafa", borderRadius: "1.5rem" }}>
        {/* Encabezado de la página */}
        <div className="d-flex align-items-center mb-4">
          <img src="/Logo9.png" alt="Icono de agenda" className="mx-auto" style={{ width: '125px', height: '125px' }} />
          <div className="card-body text-center">
            <h2 className="card-title text-primary">Agenda</h2><br />
            <p className="text-muted fst-italic">Administra tus citas programadas con facilidad.</p>
            <p className="text-muted fst-italic">Pulsa sobre una casilla del calendario para agregar un cita, o sobre una cita para operar con ella.</p>
          </div>
        </div>

        {/* Calendario principal */}
        <div className="card p-3 border-0 shadow-sm" >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
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

      {/* Modal para crear nueva cita */}
      <CitaFormModal
        show={modalCreateOpen}
        onHide={() => setModalCreateOpen(false)}
        onSubmit={handleCrearCita}
        pacientes={pacientes}
        fechaInicial={fechaSeleccionada}
      />

      {/* Modal para editar o eliminar cita existente */}
      <CitaEditModal
        show={modalEditOpen}
        onHide={() => setModalEditOpen(false)}
        onSave={handleGuardarCambios}
        onDelete={handleEliminarCita}
        cita={citaSeleccionada}
        pacientes={pacientes}
      />
    </div>
  );
};

export default AgendaPage;
