'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function useSocket(isAdmin = false) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io({
        query: isAdmin ? { admin: 'true' } : {},
      });
    }

    setSocketInstance(socket);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      if (socket) {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      }
    };
  }, [isAdmin]);

  return { socket: socketInstance, isConnected };
}
