import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, IconButton, Button, Box } from '@mui/joy';
import { Close, Notifications } from '@mui/icons-material';
import { webSocketService } from '../../services/websocket.service';

interface Notification {
  id: string;
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
}

const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    console.log('NotificationToast: Initializing WebSocket connection');
    webSocketService.connect();
    setWsConnected(true);

    // Listen for notifications
    const handleNotification = (data: any) => {
      console.log('NotificationToast: Received notification', data);
      
      const notification: Notification = {
        id: Date.now().toString(),
        type: data.type || 'NOTIFICATION',
        message: data.message || 'New notification received',
        data: data.data,
        timestamp: new Date()
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove notification after 8 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 8000);
    };

    webSocketService.on('notification', handleNotification);

    // Cleanup on unmount
    return () => {
      webSocketService.off('notification', handleNotification);
    };
  }, []);

  // Test function to simulate discrepancy notification
  const simulateDiscrepancyNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'DISCREPANCY_CREATED',
      message: 'New discrepancy created for application APP123456',
      data: {
        appNumber: 'APP123456',
        discrepancyId: 'DISC001',
        docName: 'PAN Card'
      },
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'DISCREPANCY_CREATED':
      case 'DISCREPANCY_UPDATED':
        return 'warning';
      case 'SUCCESS':
        return 'success';
      case 'ERROR':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <>
      {/* Test button for development */}
      {window.location.hostname === 'localhost' && (
        <Box sx={{ position: 'fixed', bottom: 10, right: 20, zIndex: 10000 }}>
          <Button 
            size="sm" 
            onClick={simulateDiscrepancyNotification}
            sx={{ backgroundColor: '#ff9800', mr: 1 }}
          >
            Test Notification
          </Button>
          <Button 
            size="sm" 
            color={wsConnected ? 'success' : 'danger'}
            sx={{ fontSize: '10px' }}
          >
            WS: {wsConnected ? 'ON' : 'OFF'}
          </Button>
        </Box>
      )}

      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ 
            position: 'fixed',
            top: 20 + (notifications.indexOf(notification) * 70),
            right: 20,
            zIndex: 9999
          }}
        >
          <Alert
            color={getAlertColor(notification.type)}
            startDecorator={<Notifications />}
            endDecorator={
              <IconButton
                size="sm"
                variant="plain"
                onClick={() => removeNotification(notification.id)}
              >
                <Close />
              </IconButton>
            }
            sx={{ minWidth: 300 }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>{notification.message}</div>
              {notification.data?.appNumber && (
                <div style={{ fontSize: '0.8em', marginTop: '4px' }}>
                  App: {notification.data.appNumber}
                </div>
              )}
            </div>
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationToast;
