import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TIMEOUT_MINUTES = 30;
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000;

export function useSessionTimeout(user, logout) {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const doLogout = useCallback(async () => {
    if (typeof logout === 'function') {
      await logout();
    }
    navigate('/');
  }, [navigate, logout]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (user) {
      timerRef.current = setTimeout(doLogout, TIMEOUT_MS);
    }
  }, [user, doLogout]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);
}