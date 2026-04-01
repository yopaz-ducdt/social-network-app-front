import api from './api';

export const authService = {
  // POST /home/login
  login: (username, password) => api.post('/home/login', { username, password }),

  // POST /home/register
  register: (data) => api.post('/home/register', data),

  // GET /home/forgot-password?email=...
  forgotPassword: (email) => api.get('/home/forgot-password', { params: { email } }),

  // POST /home/google
  loginWithGoogle: (payload) => api.post('/home/google', payload),
};
