import { createContext, useContext, useEffect, useState } from 'react';
import { tokenStorage } from '@/services/tokenStorage';
import { logoutEmitter } from '@/services/api';
import { decode as base64Decode } from 'base-64';

const AuthContext = createContext(null);

const decodeToken = (jwt) => {
  try {
    const payload = jwt.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    const decoded = JSON.parse(base64Decode(padded));

    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      return { expired: true };
    }

    return {
      id: decoded.id,
      username: decoded.sub,
      roles: decoded.roles ?? [],
      isAdmin: decoded.roles?.includes('ADMIN') ?? false,
      expired: false,
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const savedToken = await tokenStorage.get();

        if (savedToken) {
          const decoded = decodeToken(savedToken);

          if (decoded?.expired) {
            await tokenStorage.remove();
          } else {
            setToken(savedToken);
            setUser(decoded);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
    const unsubscribe = logoutEmitter.listen(logout);
    return () => {
      unsubscribe?.();
    };
  }, []);

  const login = async (receivedToken) => {
    const decoded = decodeToken(receivedToken);

    if (decoded?.expired) {
      throw new Error('Token expired');
    }

    await tokenStorage.set(receivedToken);
    setToken(receivedToken);
    setUser(decoded);
  };

  const logout = async () => {
    await tokenStorage.remove();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const timeout = decoded.exp * 1000 - Date.now();

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider');
  return ctx;
};
