import api from './api';

export const adminService = {
  getUsers: (name = '', page = 0, size = 10) =>
    api.get('/admin/users', { params: { name, page, size } }),

  toggleUser: (id) => api.post(`/admin/users/${id}/enabled`),

  getWarningPosts: (page = 0, size = 10) =>
    api.get('/admin/warning-posts', { params: { page, size } }),

  getPost: (id) => api.get(`/admin/posts/${id}`),

  deletePost: (id) => api.delete(`/admin/posts/${id}`),

  getAllReports: (page = 0, size = 10) => api.get('/admin/reports', { params: { page, size } }),

  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
};
