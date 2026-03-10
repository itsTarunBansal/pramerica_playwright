import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import SecureStorage from '../utils/SecureStorage';

interface ReleaseData {
  isReleased: boolean;
  moduleName: string | null;
  version: string | null;
  description: string | null;
  launchedAt: string | null;
}

interface UseReleaseNotificationsReturn {
  releaseData: ReleaseData | null;
  isConnected: boolean;
  checkReleaseStatus: () => Promise<void>;
}

export const useReleaseNotifications = (): UseReleaseNotificationsReturn => {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const checkReleaseStatus = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}api/release/status`);
      const data: ReleaseData = await response.json();
      setReleaseData(data);
    } catch (error) {
      console.error('Failed to check release status:', error);
    }
  }, []);

  useEffect(() => {
    console.log('WebSocket disabled for release notifications');
    checkReleaseStatus();
    return;
  }, [checkReleaseStatus]);

  return {
    releaseData,
    isConnected,
    checkReleaseStatus,
  };
};
