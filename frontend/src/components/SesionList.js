import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FcCalendar, FcSurvey } from "react-icons/fc";
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }
  }),
  exit: { opacity: 0, y: 60, scale: 0.97, transition: { duration: 0.3 } }
};

const SesionList = ({ pacienteId, onEditarSesion, onSesionEliminada, toastMensaje, limpiarToastMensaje }) => {
  const { authTokens } = useContext(AuthContext);
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSesiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/pacientes/${pacienteId}/sesiones/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      const ordenadas = response.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setSesiones(ordenadas);
    } catch (err) {
      console.error('Error al cargar sesiones:', err);
      setError('No se pudieron cargar las sesiones.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sesión?')) {
      try {
        await axios.delete(`http://localhost:8000/api/sesiones/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setSesiones((prev) => prev.filter((s) => s.id !== id));
        if (onSesionEliminada) onSesionEliminada();
      } catch (error) {
        console.error('Error al eliminar la sesión:', error);
        alert('No se pudo eliminar la sesión.');
      }
    }
  };

  // Función que traduce el formato de fecha  
  const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '';
        const meses = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const [a, m, d] = fechaISO.split('-');
        const dia = parseInt(d, 10);
        const mes = meses[parseInt(m, 10) - 1];
        return `${dia} de ${mes} de ${a}`;
      };

  useEffect(() => {
    if (pacienteId) {
      fetchSesiones();
    }
  }, [pacienteId]);

  useEffect(() => {
    if (toastMensaje) {
      toast.success(toastMensaje);
      if (limpiarToastMensaje) limpiarToastMensaje();
    }
  }, [toastMensaje, limpiarToastMensaje]);

  if (loading) return (
    <motion.div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
      >
        <span className="visually-hidden">Cargando...</span>
      </motion.div>
    </motion.div>
  );

  if (error) {
    return (
      <motion.div
        className="alert alert-danger"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    );
  }

  if (sesiones.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        No hay sesiones registradas.
      </motion.p>
    );
  }

  return (
    <>
      <motion.div
        className="row g-4"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <AnimatePresence>
          {sesiones.map((sesion, i) => (
            <motion.div
              key={sesion.id}
              className="col-md-6 mb-4"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 32px #fdc89c",
                borderColor: "#fd8ed3"
              }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{ borderRadius: "1.5rem" }}
            >
              <motion.div
                className="card h-100 text-center shadow rounded-4 p-3"
                style={{
                  background: "#fdfce4", // Color de relleno original conservado
                  border: "2px solid #fdc89c",
                  borderRadius: "1.5rem"
                }}
                animate={{ boxShadow: "0 2px 16px #fdc89c" }}
                transition={{ duration: 0.8 }}
              >
                <div className="card-body">
                  <div
                    className="p-3 rounded-3 w-100 text-center"
                    style={{ background: "#ffffff", border: "1px solid #fd8ed3" }}
                  >
                    <h5 className="card-title text-primary text-center">
                      <FcCalendar style={{marginRight: 6, verticalAlign: 'middle'}} />
                      {formatearFecha(sesion.fecha)}                
                    </h5>
                  </div>
                  <br />
                  <div
                    className="p-3 rounded-3 w-100 text-center"
                    style={{ background: "#ffffff", border: "1px solid #9acafa" }}
                  >
                    <h5 className="text-primary text-center">
                      <FcSurvey style={{marginRight: 6, verticalAlign: 'middle'}} />Informe de sesión
                    </h5>
                    <p className="card-text">{sesion.evaluacion || 'N/A'}</p>
                  </div>
                  <div className="mt-4 d-flex flex-row gap-3 justify-content-center align-items-center">
                    <Link to={`/sesiones/${sesion.id}`} className="btn btn-primary">
                      Consultar sesión completa
                    </Link>
                    <button
                      className="btn btn-sm px-4 py-2 shadow btn-editar"
                      onClick={() => onEditarSesion(sesion)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm px-4 py-2 shadow btn-eliminar"
                      onClick={() => handleEliminar(sesion.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SesionList;
