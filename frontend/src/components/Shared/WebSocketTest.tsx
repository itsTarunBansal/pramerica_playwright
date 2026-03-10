import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/joy';
import { webSocketService } from '../../services/websocket.service';
import SecureStorage from '../../utils/SecureStorage';

const WebSocketTest: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('');

  const connectWebSocket = () => {
    webSocketService.connect();
    setConnected(true);
    
    webSocketService.on('notification', (data: any) => {
      setLastMessage(`${data.type}: ${data.message}`);
    });
  };

  const sendTestNotification = async () => {
    const username = SecureStorage.getItem('username');
    if (!username) {
      alert('Please login first');
      return;
    }

    // Get API URL based on environment
    const getApiUrl = () => {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'https://apidev.pramericalife.in'; // Use UAT for local development
      } else if (hostname === 'sashaktuat.pramericalife.in') {
        return 'https://apidev.pramericalife.in';
      } else if (hostname === 'sashakt.pramericalife.in') {
        return 'https://api.pramericalife.in';
      }
      return 'https://apidev.pramericalife.in';
    };

    try {
      const response = await fetch(`${getApiUrl()}/api/shashakt/websocket/test-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SecureStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: username,
          message: 'Test notification from frontend'
        })
      });
      
      if (response.ok) {
        console.log('Test notification sent');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 'md', m: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>WebSocket Test</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          onClick={connectWebSocket} 
          disabled={connected}
          color={connected ? 'success' : 'primary'}
        >
          {connected ? 'Connected' : 'Connect WebSocket'}
        </Button>
        
        <Button 
          onClick={sendTestNotification}
          disabled={!connected}
          color="warning"
        >
          Send Test Notification
        </Button>
      </Box>
      
      {lastMessage && (
        <Typography level="body-sm" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
          Last message: {lastMessage}
        </Typography>
      )}
    </Box>
  );
};

export default WebSocketTest;
