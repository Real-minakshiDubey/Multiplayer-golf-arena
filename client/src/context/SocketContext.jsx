import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getSocket, disconnectSocket } from '../utils/socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (token) {
      const s = getSocket(token);
      setSocket(s);

      s.on('connect', () => setConnected(true));
      s.on('disconnect', () => setConnected(false));

      return () => {
        s.off('connect');
        s.off('disconnect');
      };
    } else {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);