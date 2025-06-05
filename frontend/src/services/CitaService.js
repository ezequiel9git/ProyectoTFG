import axios from 'axios';

// URL base de la API para las citas
const API_BASE_URL = 'http://localhost:8000/api/citas/';

/**
 * Obtiene todas las citas desde la API.
 * @param {Object} authTokens - Tokens de autenticación.
 * @returns {Promise<Array>} Lista de citas.
 */
const getCitas = async (authTokens) => {
  const response = await axios.get(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  });
  return response.data;
};

/**
 * Crea una nueva cita en la API.
 * @param {Object} authTokens - Tokens de autenticación.
 * @param {Object} nuevaCita - Datos de la nueva cita.
 * @returns {Promise<Object>} Cita creada.
 */
const crearCita = async (authTokens, nuevaCita) => {
  const response = await axios.post(API_BASE_URL, nuevaCita, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Actualiza una cita existente en la API.
 * @param {Object} authTokens - Tokens de autenticación.
 * @param {number|string} citaId - ID de la cita a actualizar.
 * @param {Object} datosActualizados - Datos a actualizar.
 * @returns {Promise<Object>} Cita actualizada.
 */
const actualizarCita = async (authTokens, citaId, datosActualizados) => {
  const response = await axios.put(`${API_BASE_URL}${citaId}/`, datosActualizados, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

/**
 * Elimina una cita de la API.
 * @param {Object} authTokens - Tokens de autenticación.
 * @param {number|string} citaId - ID de la cita a eliminar.
 * @returns {Promise<void>}
 */
const eliminarCita = async (authTokens, citaId) => {
  await axios.delete(`${API_BASE_URL}${citaId}/`, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  });
};

export { getCitas, crearCita, actualizarCita, eliminarCita };
