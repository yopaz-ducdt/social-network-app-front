import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: '*/*',
  },
});

// ── Request: tự động gắn token vào mọi request ───────────────
api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: chuẩn hoá lỗi + tự logout khi 401 ─────────────
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → xoá token, AuthContext sẽ tự redirect về Login
      await tokenStorage.remove();

      // Trigger logout qua custom event (AuthContext lắng nghe)
      logoutEmitter.emit();
    }

    const message = error.response?.data?.message ?? error.message ?? 'Lỗi không xác định';
    return Promise.reject(new Error(message));
  }
);

// ── Logout emitter: kết nối api.js với AuthContext ────────────
const logoutEmitter = (() => {
  let _cb = null;
  return {
    listen: (cb) => {
      _cb = cb;
    },
    emit: () => {
      _cb?.();
    },
  };
})();

export { logoutEmitter };
export default api;
