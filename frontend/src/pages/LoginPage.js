import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, password } = formData;

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const result = await loginUser(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error inesperado. Intente nuevamente.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("/Fondo1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
            Accede a tu cuenta para gestionar tus pacientes, sesiones, agenda y más.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Introduce tu nombre de usuario"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Introduce tu contraseña"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary fw-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
