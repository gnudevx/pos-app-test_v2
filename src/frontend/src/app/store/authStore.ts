import { useState } from 'react';

interface AuthState {
  token: string | null;
  user: { id: string; username: string } | null;
  login: (token: string, user: { id: string; username: string }) => void;
  logout: () => void;
}

const useAuthStore = (): AuthState => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<{ id: string; username: string } | null>(() => {
    const storedUser = localStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (newToken: string, newUser: { id: string; username: string }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return { token, user, login, logout };
};

export default useAuthStore;