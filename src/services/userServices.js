import api from './api';

export const userService = {
  // ── Profile ──────────────────────────────────────────────
  // GET /user/profile
  getProfile: () => api.get('/user/profile'),

  // GET /user/:userId (Xem profile người khác)
  getUserById: (userId) => api.get(`/user/users/${userId}`),

  getUserPostsById: (userId, page = 0, size = 10) =>
    api.get(`/user/users/${userId}/posts`, { params: { page, size } }),

  // POST /user/profile
  updateProfile: (userDTO, imageFile) => {
    const form = new FormData();
    form.append('firstName', userDTO.firstName);
    form.append('lastName', userDTO.lastName);
    form.append('gender', userDTO.gender);
    if (imageFile) {
      form.append('image', {
        uri: imageFile.uri,
        type: imageFile.type ?? 'image/jpeg',
        name: imageFile.name ?? 'avatar.jpg',
      });
    }
    return api.post('/user/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // POST /user/change-password
  changePassword: (oldPassword, newPassword) =>
    api.post('/user/change-password', { oldPassword, newPassword }),

  // ── Posts ─────────────────────────────────────────────────
  // GET /user/user-posts?page=&size=
  getUserPosts: (page = 0, size = 10) => api.get('/user/user-posts', { params: { page, size } }),

  // GET /user/follower-posts?page=&size=  (feed)
  getFeedPosts: (page = 0, size = 10) =>
    api.get('/user/follower-posts', { params: { page, size } }),

  // GET /user/posts/:id
  getPost: (id) => api.get(`/user/posts/${id}`),

  // GET /user/posts/:id/user-like
  doUserLike: (id) => api.get(`/user/posts/${id}/user-like`),

  // POST /user/user-posts — append title, content + images vào FormData
  createPost: (postDTO, imageFiles = []) => {
    const form = new FormData();
    form.append('title', postDTO.title);
    form.append('content', postDTO.content);
    imageFiles.forEach((file, i) => {
      form.append('images', {
        uri: file.uri,
        type: file.type ?? 'image/jpeg',
        name: file.name ?? `image_${i}.jpg`,
      });
    });
    return api.post('/user/user-posts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // PUT /user/user-posts/:id — json bình thường
  updatePost: (id, title, content) => api.put(`/user/user-posts/${id}`, { title, content }),

  // DELETE /user/user-posts/:id
  deletePost: (id) => api.delete(`/user/user-posts/${id}`),

  // ── Like ──────────────────────────────────────────────────
  // POST /user/posts/:id/like  (toggle)
  likePost: (id) => api.post(`/user/posts/${id}/like`),

  // ── Comments ──────────────────────────────────────────────
  // POST /user/posts/:id/comments
  createComment: (postId, content) => api.post(`/user/posts/${postId}/comments`, { content }),

  // DELETE /user/comments/:id
  deleteComment: (id) => api.delete(`/user/comments/${id}`),

  // ── Follow ────────────────────────────────────────────────
  // POST /user/followers/:followerId  (toggle follow/unfollow)
  follow: (followerId) => api.post(`/user/followers/${followerId}`),

  // GET /user/followers
  getFollowers: () => api.get('/user/followers'),

  // ── Search users ──────────────────────────────────────────
  // GET /user/users?name=&page=&size=
  findUsers: (name = '', page = 0, size = 10) =>
    api.get('/user/users', { params: { name, page, size } }),

  // POST /user/posts/:id/reports
  createReport: (postId, title, content) =>
    api.post(`/user/posts/${postId}/reports`, { title, content }),

  // GET /user/notifications
  getNotifications: (page = 0, size = 10) =>
    api.get('/user/notifications', { params: { page, size } }),

  // POST /user/notifications/:id
  readNotification: (id) => api.post(`/user/notifications/${id}`),

  // GET /user/following
  getFollowing: () => api.get('/user/following'),
};
