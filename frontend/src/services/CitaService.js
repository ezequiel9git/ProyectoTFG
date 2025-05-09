import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/citas/';

const getCitas = async (authTokens) => {
  const response = await axios.get(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  });
  return response.data;
};

const crearCita = async (authTokens, nuevaCita) => {
  const response = await axios.post(API_BASE_URL, nuevaCita, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const actualizarCita = async (authTokens, citaId, datosActualizados) => {
  const response = await axios.put(`${API_BASE_URL}${citaId}/`, datosActualizados, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const eliminarCita = async (authTokens, citaId) => {
  await axios.delete(`${API_BASE_URL}${citaId}/`, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  });
};

export { getCitas, crearCita, actualizarCita, eliminarCita };
