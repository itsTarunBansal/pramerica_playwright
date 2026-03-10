import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Card } from '@mui/joy';
import { webSocketService } from '../../services/websocket.service';
import SecureStorage from '../../utils/SecureStorage';

const WebSocketDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[WebSocket Debug] ${message}`);
  };

  const checkEnvironment = () => {
    const hostname = window.location.hostname;
    const username = SecureStorage.getItem('username');
    const token = SecureStorage.getItem('token');
    
    addLog(`Current hostname: ${hostname}`);
    addLog(`Username: ${username ? 'Present' : 'Missing'}`);
    addLog(`Token: ${token ? 'Present' : 'Missing'}`);
    
    let wsUrl = '';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      wsUrl = 'https://apidev.pramericalife.in';
    } else if (hostname === 'sashaktuat.pramericalife.in') {
      wsUrl = 'https://apidev.pramericalife.in';
    } else if (hostname === 'sashakt.pramericalife.in') {
      wsUrl = 'https://api.pramericalife.in';
    } else {
      wsUrl = 'https://apidev.pramericalife.in';
    }
    
    addLog(`WebSocket URL: ${wsUrl}`);
  };

  const testWebSocketService = () => {
    addLog('Starting WebSocket service test...');
    
    try {
      webSocketService.connect();
      setConnected(true);
      addLog('WebSocket connect() called');
      
      webSocketService.on('notification', (data: any) => {
        addLog(`Service notification: ${JSON.stringify(data)}`);
      });
      
    } catch (error) {
      addLog(`Error connecting: ${error}`);
    }
  };

  const testDirectConnection = async () => {
    addLog('Testing direct Socket.IO connection...');
    
    try {
      const { io } = await import('socket.io-client');
      const wsUrl = 'https://apidev.pramericalife.in';
      
      addLog(`Direct connection to: ${wsUrl}`);
      
      const socket = io(wsUrl, {
        transports: ['polling', 'websocket'],
        autoConnect: true,
        reconnection: true,
        timeout: 15000,
      });

      socket.on('connect', () => {
        addLog('✅ Direct connection successful!');
        addLog(`Socket ID: ${socket.id}`);
        addLog(`Transport: ${socket.io.engine.transport.name}`);
        
        const username = SecureStorage.getItem('username');
        if (username) {
          socket.emit('join', username);
          addLog(`Joined room with username: ${username}`);
        }
      });

      socket.on('joined', (data) => {
        addLog(`✅ Room joined: ${JSON.stringify(data)}`);
      });

      socket.on('connect_error', (error) => {
        addLog(`❌ Direct connection error: ${error.message}`);
      });

      socket.on('disconnect', (reason) => {
        addLog(`❌ Direct disconnected: ${reason}`);
      });

      socket.on('notification', (data) => {
        addLog(`📢 Direct notification: ${JSON.stringify(data)}`);
      });
   

    } catch (error) {
      addLog(`❌ Direct connection error: ${error}`);
    }
  };

  const testAPIEndpoint = async () => {
    addLog('Testing WebSocket API endpoint...');
    
    try {
      const token = SecureStorage.getItem('token');
      const response = await fetch('https://apidev.pramericalife.in/api/websocket/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ API Status: ${JSON.stringify(data)}`);
      } else {
        addLog(`❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addLog(`❌ API Request failed: ${error}`);
    }
  };

  const sendTestNotification = async () => {
    addLog('Sending test notification...');
    
    try {
      const token = SecureStorage.getItem('token');
      const username = SecureStorage.getItem('username');
      
      if (!token || !username) {
        addLog('❌ Missing token or username');
        return;
      }
      
      const response = await fetch('https://apidev.pramericalife.in/api/websocket/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          message: 'Test notification from debug panel'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Test notification sent: ${JSON.stringify(data)}`);
      } else {
        addLog(`❌ Test notification failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addLog(`❌ Test notification error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card sx={{ p: 3, m: 2, maxWidth: 800 }}>
      <Typography level="h3" sx={{ mb: 2 }}>WebSocket Debug Console</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button onClick={checkEnvironment} color="neutral" size="sm">
          Check Environment
        </Button>
        <Button onClick={testAPIEndpoint} color="primary" size="sm">
          Test API
        </Button>
        <Button onClick={testWebSocketService} color="success" size="sm">
          Test Service
        </Button>
        <Button onClick={testDirectConnection} color="warning" size="sm">
          Direct Test
        </Button>
        <Button onClick={sendTestNotification} color="danger" size="sm">
          Send Test
        </Button>
        <Button onClick={clearLogs} color="neutral" variant="outlined" size="sm">
          Clear
        </Button>
      </Box>
      
      <Box 
        sx={{ 
          height: 400, 
          overflow: 'auto', 
          bgcolor: 'background.level1', 
          p: 2, 
          borderRadius: 'sm',
          fontFamily: 'monospace',
          fontSize: 'xs'
        }}
      >
        {logs.length === 0 ? (
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            No logs yet. Click a button above to start testing.
          </Typography>
        ) : (
          logs.map((log, index) => (
            <Typography 
              key={index} 
              level="body-xs" 
              sx={{ 
                mb: 0.5,
                color: log.includes('❌') ? 'danger.500' : 
                       log.includes('✅') ? 'success.500' : 
                       log.includes('📢') ? 'warning.500' : 'text.primary'
              }}
            >
              {log}
            </Typography>
          ))
        )}
      </Box>
    </Card>
  );
};

export default WebSocketDebug;
