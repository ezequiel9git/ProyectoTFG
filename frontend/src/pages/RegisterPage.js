import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/register/', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Error al registrar usuario. Verifique los datos ingresados.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("/Fondo1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div
        className="bg-white bg-opacity-75 p-5 rounded-4 shadow-lg"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className="text-center mb-4">
          <img
            src="/LogoElysia.png"
            alt="Logo de la aplicación"
            style={{ width: '200px', height: 'auto' }}
            className="mb-3"
          />
          <p className="text-secondary">
            Crea tu cuenta para comenzar a utilizar nuestra plataforma de gestión de pacientes y sesiones.
          </p>
        </div>

        {success && (
          <div className="alert alert-success">
            Registro exitoso. Redirigiendo al login...
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Introduce un nombre de usuario"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Crea una contraseña segura"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Repetir contraseña</label>
            <input
              type="password"
              name="password2"
              className="form-control"
              value={formData.password2}
              onChange={handleChange}
              required
              placeholder="Vuelve a escribir la contraseña"
            />
          </div>
          <button className="btn btn-success w-100" type="submit">
            Registrarse
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-success fw-bold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
