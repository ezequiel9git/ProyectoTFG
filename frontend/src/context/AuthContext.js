import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Contexto de autenticación global para la aplicación
const AuthContext = createContext();
export default AuthContext;

// Proveedor de autenticación que gestiona el estado y las funciones de login/logout
export const AuthProvider = ({ children }) => {
  // Estado para los tokens de autenticación (access y refresh)
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );

  // Estado para el usuario autenticado (decodificado del token)
  const [user, setUser] = useState(() => {
    try {
      const tokens = localStorage.getItem('authTokens');
      return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
    } catch (e) {
      return null;
    }
  });

  // Estado para controlar la carga inicial del contexto
  const [loading, setLoading] = useState(true);

  /**
   * Inicia sesión con usuario y contraseña.
   * Guarda los tokens y el usuario en el estado y localStorage.
   */
  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.detail || 'Credenciales inválidas o error del servidor.',
      };
    }
  };

  /**
   * Cierra la sesión del usuario y limpia los datos de autenticación.
   */
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  /**
   * Refresca el token de acceso usando el token de refresh.
   * Si falla, cierra la sesión.
   */
  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/token/refresh/',
        { refresh: authTokens.refresh }
      );

      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
    } catch (error) {
      logoutUser();
    }
  };

  // Al montar, decodifica el usuario si hay tokens y marca como cargado
  useEffect(() => {
    if (authTokens) {
      try {
        setUser(jwtDecode(authTokens.access));
      } catch {
        logoutUser(); // Token inválido
      }
    }
    setLoading(false);
  }, []);

  // Refresca el token automáticamente cada 5 minutos si hay sesión activa
  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) updateToken();
    }, 1000 * 60 * 5); // cada 5 minutos
    return () => clearInterval(interval);
  }, [authTokens]);

  // Datos y funciones expuestos por el contexto
  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* Renderiza los hijos solo cuando termina la carga inicial */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
