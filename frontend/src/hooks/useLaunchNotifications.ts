import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import SecureStorage from '../utils/SecureStorage';

interface LaunchData {
  plan: any;
  countdown?: number;
  remainingTime?: number;
  completed?: boolean;
}

interface UseLaunchNotificationsReturn {
  launchData: LaunchData | null;
  isConnected: boolean;
  clearLaunchData: () => void;
}

export const useLaunchNotifications = (): UseLaunchNotificationsReturn => {
  const [launchData, setLaunchData] = useState<LaunchData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const clearLaunchData = useCallback(() => {
    setLaunchData(null);
  }, []);

  useEffect(() => {
    console.log('WebSocket disabled for launch notifications');
    return;
  }, []);

  return {
    launchData,
    isConnected,
    clearLaunchData,
  };
};
