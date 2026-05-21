import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import api from '../../../api/axios';

export const UserContext = createContext(null);

const initialUser = {
  id: null,
  username: '',
  first_name: '',
  last_name: '',
  surname: '',
  role: '',
  group: '',
  totp_enabled: false
};

export const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState(initialUser);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState();
  const [attemptInfo, setAttemptInfo] = useState({
    totalTime: 0,
    seconds: 0,
    question_id: 0,
    points: 0,
    subject: '',
    answers: [],
  });
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const setUserFromResponse = useCallback((data) => {
    setUser({
      id: data.id,
      username: data.username,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      surname: data.surname || '',
      role: data.role || '',
      group: data.role === 'STUDENT'
        ? (data.study_group?.name || data.study_group || '')
        : '',
      totp_enabled: data.totp_enabled ?? false,
    });
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(initialUser);
    setIsAuthenticated(false);
  }, []);

  const loadMe = useCallback(async () => {
    const response = await api.get('/me/');
    setUserFromResponse(response.data);
    return response.data;
  }, [setUserFromResponse]);

  // Используется после OTP-верификации: принимает данные пользователя
  // из ответа /2fa/verify/ и устанавливает сессию без дополнительного запроса
  const setSession = useCallback((userData) => {
    setUserFromResponse(userData);
    setAuthReady(true);
  }, [setUserFromResponse]);

  const refreshSession = useCallback(async () => {
    try {
      await api.post('/token/refresh/');
      await loadMe();
      return true;
    } catch (error) {
      clearAuth();
      return false;
    } finally {
      setAuthReady(true);
    }
  }, [loadMe, clearAuth]);

  const login = useCallback(async (credentials) => {
    const response = await api.post('/login/', credentials);
    // Если 202 — 2FA требуется, не устанавливаем пользователя
    if (response.status === 202) {
      return response.data;
    }
    setUserFromResponse(response.data.user);
    setAuthReady(true);
    return response.data;
  }, [setUserFromResponse]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout/');
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
      localStorage.removeItem('answers');
      localStorage.removeItem('aid');
    }
  }, [clearAuth]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        authReady,
        login,
        logout,
        setSession,
        refreshSession,
        loadMe,
        questions,
        setQuestions,
        attemptInfo,
        setAttemptInfo,
        open,
        setOpen,
        detailsOpen,
        setDetailsOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};