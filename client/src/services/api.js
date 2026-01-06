import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getAlumni = () => api.get('/alumni');
// No futuro, o TD usará: export const createAlumnus = (data) => api.post('/alumni', data);

export default api;
