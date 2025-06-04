import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }
  }),
};

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          backgroundImage: "url('/Fondo2.png')",
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
      <div className="container py-5">
        <motion.div
          className="container bg-white bg-opacity-75 rounded-4 shadow p-5"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="d-flex align-items-center mb-4"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 60 }}
          >
            <motion.img
              src="/LogoElysia.png"
              alt="Icono de la aplicación"
              className="mx-auto"
              style={{ width: '200px', height: '200px' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 80 }}
            />
            <div className="card-body text-center">
              <motion.h2
                className="card-title text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Bienvenido, {user && user.username}
              </motion.h2>
              <p></p>
              <motion.p
                className="mb-5 fs-5 fst-italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                Este es tu panel principal. <br />
                Gestiona pacientes y sesiones, consulta estadísticas y administra tu agenda de citas.
              </motion.p>
            </div>
          </motion.div>

          <div className="row g-4">
            {/* Pacientes */}
            <motion.div
              className="col-md-4"
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.04,
                background: "linear-gradient(135deg, #e4baf8 0%, #fff 100%)",
                boxShadow: "0 0 32px #e4baf8",
                borderColor: "#a16ae8"
              }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{ borderRadius: "1.5rem" }}
            >
              <motion.div
                className="card h-100 text-center shadow rounded-4 p-3"
                style={{
                  background: "#ffffff",
                  border: "2px solid #e4baf8",
                  borderRadius: "1.5rem"
                }}
                animate={{ boxShadow: "0 2px 16px #e4baf8" }}
                transition={{ duration: 0.8 }}
              >
                <img src="/LogoPacientes.png" alt="Pacientes" className="mx-auto" style={{ width: '80px', height: '80px' }} />
                <div className="card-body">
                  <h4 className="card-title text-success">Pacientes y sesiones</h4>
                  <p className="card-text">
                    Gestiona tu lista de pacientes y accede a sus sesiones individuales.
                  </p>
                  <Link to="/pacientes" className="btn btn-primary">
                    Ir a Pacientes y sesiones
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Reportes */}
            <motion.div
              className="col-md-4"
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.04,
                background: "linear-gradient(135deg, #68fac9 0%, #fff 100%)",
                boxShadow: "0 0 32px #68fac9",
                borderColor: "#1ecb8c"
              }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{ borderRadius: "1.5rem" }}
            >
              <motion.div
                className="card h-100 text-center shadow rounded-4 p-3"
                style={{
                  background: "#ffffff",
                  border: "2px solid #68fac9",
                  borderRadius: "1.5rem"
                }}
                animate={{ boxShadow: "0 2px 16px #68fac9" }}
                transition={{ duration: 0.8 }}
              >
                <img src="/LogoReportes.png" alt="Reportes" className="mx-auto" style={{ width: '80px', height: '80px' }} />
                <div className="card-body">
                  <h4 className="card-title text-success">Estadísticas</h4>
                  <p className="card-text">
                    Consulta estadísticas relevantes de pacientes y sesiones.
                  </p>
                  <Link to="/reportes" className="btn btn-primary">
                    Consultar estadísticas
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Agenda */}
            <motion.div
              className="col-md-4"
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.04,
                background: "linear-gradient(135deg, #9acafa 0%, #fff 100%)",
                boxShadow: "0 0 32px #9acafa",
                borderColor: "#3a8ee6"
              }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{ borderRadius: "1.5rem" }}
            >
              <motion.div
                className="card h-100 text-center shadow rounded-4 p-3"
                style={{
                  background: "#ffffff",
                  border: "2px solid #9acafa",
                  borderRadius: "1.5rem"
                }}
                animate={{ boxShadow: "0 2px 16px #9acafa" }}
                transition={{ duration: 0.8 }}
              >
                <img src="/LogoAgenda.png" alt="Agenda" className="mx-auto" style={{ width: '80px', height: '80px' }} />
                <div className="card-body">
                  <h4 className="card-title text-success">Agenda</h4>
                  <p className="card-text">
                    Visualiza y gestiona tus citas terapéuticas en el calendario.
                  </p>
                  <Link to="/agenda" className="btn btn-primary">
                    Gestionar agenda
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
