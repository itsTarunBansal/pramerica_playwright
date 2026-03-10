import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, ModalDialog, LinearProgress } from '@mui/joy';
import { Rocket, CheckCircle } from '@mui/icons-material';

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    type: 'LAUNCH_COUNTDOWN_STARTED' | 'MODULE_LAUNCHED' | 'LAUNCH_CANCELLED';
    moduleName: string;
    version: string;
    description: string;
    countdownEndsAt?: string;
    countdownDuration?: number;
  } | null;
}

const LaunchModal: React.FC<LaunchModalProps> = ({ isOpen, onClose, data }) => {
  const [countdown, setCountdown] = useState(0);
  const [progress, setProgress] = useState(0);

  const getLaunchStatusApi = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}api/release/status`);
      if (response.ok) {
        const result = await response.json();
        console.log('Launch status:', result);
      }
    } catch (error) {
      console.error('Failed to get launch status:', error);
    }
  };

  useEffect(() => {
    if (!data || !data.countdownEndsAt) return;
 
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(data.countdownEndsAt!).getTime();
      const remaining = Math.max(0, Math.ceil((end - now) / 1000));
     
      setCountdown(remaining);
      setProgress(((data.countdownDuration! - remaining) / data.countdownDuration!) * 100);
 
      if (remaining === 0) {
        clearInterval(interval);
        getLaunchStatusApi();
      }
    }, 1000);
 
    return () => clearInterval(interval);
  }, [data, getLaunchStatusApi]);

  if (!data) return null;

  const isCountdown = data.type === 'LAUNCH_COUNTDOWN_STARTED';
  const isLaunched = data.type === 'MODULE_LAUNCHED';
  const isCancelled = data.type === 'LAUNCH_CANCELLED';

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 500,
          p: 4,
          textAlign: 'center',
          background: isLaunched 
            ? 'linear-gradient(135deg, #001f45 0%, #003366 50%, #004080 100%)'
            : isCancelled
            ? 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%)'
            : 'linear-gradient(135deg, #2D1B69 0%, #11998E 100%)',
          color: 'white',
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: '50%',
            background: isLaunched 
              ? 'linear-gradient(135deg, #FFD700, #FFA500)'
              : 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
            mx: 'auto',
            width: 'fit-content',
          }}
        >
          {isLaunched ? (
            <CheckCircle sx={{ fontSize: '48px', color: '#001f45' }} />
          ) : (
            <Rocket sx={{ fontSize: '48px', color: 'white' }} />
          )}
        </Box>

        {/* Title */}
        <Typography
          level="h2"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 2,
            fontSize: '1.8rem',
          }}
        >
          {isLaunched ? '🎉 Module Launched!' : isCancelled ? '❌ Launch Cancelled' : '🚀 Module Launching Soon!'}
        </Typography>

        {/* Module Info */}
        <Typography
          level="h3"
          sx={{
            color: '#FFD700',
            fontWeight: 'bold',
            mb: 1,
            fontSize: '1.4rem',
          }}
        >
          {data.moduleName} {data.version}
        </Typography>

        <Typography
          level="body-lg"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {data.description}
        </Typography>

        {/* Countdown Section */}
        {isCountdown && countdown > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              level="h1"
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                fontSize: '3rem',
                mb: 1,
              }}
            >
              {countdown}
            </Typography>
            <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              seconds remaining
            </Typography>
            <LinearProgress
              determinate
              value={progress}
              sx={{
                '--LinearProgress-thickness': '8px',
                '--LinearProgress-progressColor': '#FFD700',
              }}
            />
          </Box>
        )}

        {/* Launch Complete Message */}
        {isLaunched && (
          <Box sx={{ mb: 3 }}>
            <Typography
              level="body-lg"
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              ✨ The module is now available in your dashboard!
            </Typography>
          </Box>
        )}

        {/* Action Button */}
        <Button
          onClick={onClose}
          size="lg"
          sx={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#001f45',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #FFA500, #FFD700)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isLaunched ? 'Explore Now' : 'Got It'}
        </Button>
      </ModalDialog>
    </Modal>
  );
};

export default LaunchModal;
