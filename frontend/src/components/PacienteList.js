import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FcHighPriority, FcMediumPriority, FcLowPriority, FcFinePrint } from "react-icons/fc";
import { motion, AnimatePresence } from 'framer-motion'; // Añadido
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Variantes de animación para las filas de la tabla
const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.07, duration: 0.5, type: 'spring', stiffness: 60 }
  }),
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } }
};

/**
 * Lista de pacientes con opciones para filtrar, buscar, editar y eliminar.
 * Permite gestionar pacientes y acceder a sus sesiones.
 */
const PacienteList = ({ onEditarPaciente, recargarTrigger, toastMensaje, limpiarToastMensaje }) => {
  // Obtiene los tokens de autenticación del contexto
  const { authTokens } = useContext(AuthContext);
  // Estado para la lista de pacientes
  const [pacientes, setPacientes] = useState([]);
  // Estado para mostrar errores de carga
  const [error, setError] = useState(null);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para el filtro de búsqueda por nombre
  const [busqueda, setBusqueda] = useState("");
  // Estado para el filtro por prioridad
  const [prioridadFiltro, setPrioridadFiltro] = useState("");

  // Mostrar toast si viene mensaje desde el padre (crear/editar)
  useEffect(() => {
    if (toastMensaje) {
      toast.success(toastMensaje);
      if (limpiarToastMensaje) limpiarToastMensaje();
    }
  }, [toastMensaje, limpiarToastMensaje]);

  // Obtiene la lista de pacientes desde la API
  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/pacientes/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setPacientes(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar pacientes.');
      toast.error('Error al cargar pacientes.');
    }
    setLoading(false);
  };

  // Elimina un paciente por su ID
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
      try {
        await axios.delete(`http://localhost:8000/api/pacientes/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setPacientes(prev => prev.filter(p => p.id !== id));
        toast.success('Paciente eliminado correctamente.');
      } catch (err) {
        console.error(err);
        toast.error('Error al eliminar el paciente.');
      }
    }
  };

  // Función que traduce el formato de la prioridad a un icono
  const renderPrioridad = (prioridad) => {
    if (prioridad === 'Alta') {
      return <FcHighPriority size={28} title="Alta" />;
    }
    if (prioridad === 'Media') {
      return <FcMediumPriority size={28} title="Media" />;
    }
    // Baja u otro valor
    return <FcLowPriority size={28} title="Baja" />;
  };

  // Filtra pacientes por nombre y prioridad
  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (prioridadFiltro === "" || p.prioridad_seguimiento === prioridadFiltro)
  );

  // Carga los pacientes al montar el componente o cuando recargarTrigger cambie
  useEffect(() => {
    fetchPacientes();
  }, [recargarTrigger]);

  return (
    <motion.div
      className="mt-1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >

      {/* Encabezado y descripción */}
      <motion.div
        className="d-flex align-items-center mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 60 }}
      >
        <motion.img
          src="/LogoPacientes.png"
          alt="Pacientes"
          className="mx-auto"
          style={{ width: '125px', height: '125px' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 80 }}
        />
        <div className="card-body">
          <motion.p
            style={{ fontStyle: "italic", textAlign: "center" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Aquí se muestran todos los pacientes que tienes registrados.
          </motion.p>
          <motion.p
            style={{ fontStyle: "italic", textAlign: "center" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Desde este panel, podrás gestionar los registros y acceder a su informe de sesiones.
          </motion.p>
        </div>
      </motion.div>

      {/* Mensaje de error o carga */}
      {error && <motion.div className="alert alert-danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
      {loading ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Cargando pacientes...</motion.p>
      ) : (

        <div className="table-responsive">
          {/* Campo de búsqueda y filtro de prioridad */}
          <div className="mb-3 row align-items-end">
            {/* Filtro de búsqueda a la izquierda */}
            <div className="col-md-4">
              <label htmlFor="busquedaNombre" className="form-label fw-semibold">
                <FcFinePrint style={{ marginRight: 6 }} /> Filtra pacientes por su nombre
              </label>
              <input
                id="busquedaNombre"
                type="text"
                className="form-control"
                placeholder="Introduce el nombre del paciente..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={{ maxWidth: 300 }}
              />
            </div>
            {/* Espacio vacío para centrar los filtros si es necesario */}
            <div className="col-md-4"></div>
            {/* Filtro de prioridad a la derecha */}
            <div className="col-md-4">
              <label
                htmlFor="prioridadFiltro"
                className="form-label fw-semibold"
                style={{ display: "block", textAlign: "right" }} // Alineación derecha
              >
                Filtrar por prioridad
                <FcHighPriority style={{ marginLeft: 6 }} />
              </label>
              <select
                id="prioridadFiltro"
                className="form-select"
                value={prioridadFiltro}
                onChange={e => setPrioridadFiltro(e.target.value)}
                style={{ maxWidth: 220, marginLeft: "auto" }}
              >
                <option value="">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          {/* Tabla de pacientes */}
          <table className="table table-striped table-bordered shadow-sm rounded">
            <thead className="table-light" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
              <tr>
                <th style={{ backgroundColor: '#70041b', color: 'white' }}>Nombre</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Edad</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Teléfono</th>
                <th style={{ backgroundColor: '#380694', color: 'white' }}>Dirección</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Asunto</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Medicación</th>
                <th style={{ backgroundColor: '#035e0a', color: 'white' }}>Prioridad</th>
                <th style={{ backgroundColor: '#700346', color: 'white' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan="8" className="text-center py-4">
                    No hay pacientes registrados.
                  </td>
                </motion.tr>
              ) : (
                <AnimatePresence>
                  {pacientesFiltrados.map((paciente, i) => (
                    <motion.tr
                      key={paciente.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <td>{paciente.nombre}</td>
                      <td>{paciente.edad}</td>
                      <td>{paciente.telefono}</td>
                      <td>{paciente.direccion}</td>
                      <td>{paciente.asunto || '-'}</td>
                      <td>{paciente.medicacion || '-'}</td>
                      <td className="text-center align-middle">{renderPrioridad(paciente.prioridad_seguimiento)}</td>
                      <td className="d-flex flex-wrap gap-2">
                        <Link
                          to={`/pacientes/${paciente.id}/sesiones`}
                          className="btn btn-sm  px-3 shadow btn-agregar"
                        > Gestionar sesiones
                        </Link>
                        <button
                          className="btn btn-sm  px-3 shadow btn-editar"
                          onClick={() => onEditarPaciente(paciente)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm  px-3 shadow btn-eliminar"
                          onClick={() => handleEliminar(paciente.id)}
                        >
                          Borrar
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Contenedor para mensajes toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default PacienteList;
