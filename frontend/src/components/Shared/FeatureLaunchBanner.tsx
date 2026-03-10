import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/joy';
import { Close, AdminPanelSettings, Celebration } from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import SecureStorage from '../../utils/SecureStorage';

interface ReleaseData {
  isReleased: boolean;
  moduleName: string | null;
  version: string | null;
  description: string | null;
  launchedAt: string | null;
}

interface FeatureLaunchBannerProps {
  onDismiss?: () => void;
}

const FeatureLaunchBanner: React.FC<FeatureLaunchBannerProps> = ({ onDismiss }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<'closed' | 'opening' | 'open'>('closed');
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Check release status on component mount
  useEffect(() => {
    checkReleaseStatus();
    initializeWebSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const checkReleaseStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_PATH}api/release/status`);
      const data: ReleaseData = await response.json();
      
      if (data.isReleased && !showBanner) {
        setReleaseData(data);
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Failed to check release status:', error);
    }
  };

  const initializeWebSocket = () => {
    console.log('WebSocket disabled for FeatureLaunchBanner');
    return;
  };

  useEffect(() => {
    if (showBanner) {
      setTimeout(() => setAnimationPhase('opening'), 100);
      setTimeout(() => setAnimationPhase('open'), 1500);
    } else {
      setAnimationPhase('closed');
    }
  }, [showBanner]);

  const handleDismiss = () => {
    setShowBanner(false);
    setAnimationPhase('closed');
    onDismiss?.();
  };

  if (!showBanner || !releaseData) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
      }}
    >
      {/* Curtain Animation Container */}
      <Box
        sx={{
          position: 'relative',
          width: '80%',
          maxWidth: '600px',
          height: '400px',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Left Curtain */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, #8B0000, #DC143C)',
            transform: animationPhase === 'closed' ? 'translateX(0%)' : 
                      animationPhase === 'opening' ? 'translateX(-100%)' : 'translateX(-100%)',
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 2,
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '20px',
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3))',
            }
          }}
        />

        {/* Right Curtain */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, #DC143C, #8B0000)',
            transform: animationPhase === 'closed' ? 'translateX(0%)' : 
                      animationPhase === 'opening' ? 'translateX(100%)' : 'translateX(100%)',
            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 2,
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '20px',
              background: 'linear-gradient(270deg, transparent, rgba(0,0,0,0.3))',
            }
          }}
        />

        {/* Main Content */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #001f45 0%, #003366 50%, #004080 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            opacity: animationPhase === 'open' ? 1 : 0,
            transform: animationPhase === 'open' ? 'scale(1)' : 'scale(0.9)',
            transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleDismiss}
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <Close />
          </IconButton>

          {/* Feature Icon */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
              animation: animationPhase === 'open' ? 'bounce 2s infinite' : 'none',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-10px)' },
                '60%': { transform: 'translateY(-5px)' },
              }
            }}
          >
            <Celebration sx={{ fontSize: '48px', color: '#001f45' }} />
          </Box>

          {/* Title */}
          <Typography
            level="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            🎉 New Feature Launched!
          </Typography>

          {/* Feature Name & Version */}
          <Typography
            level="h2"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {releaseData.moduleName} {releaseData.version}
          </Typography>

          {/* Description */}
          <Typography
            level="body-lg"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              maxWidth: '400px',
              lineHeight: 1.6,
            }}
          >
            {releaseData.description}
          </Typography>

          {/* Launch Date */}
          {releaseData.launchedAt && (
            <Typography
              level="body-sm"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontStyle: 'italic',
              }}
            >
              Launched: {new Date(releaseData.launchedAt).toLocaleString()}
            </Typography>
          )}

          {/* Action Button */}
          <Button
            onClick={handleDismiss}
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
            Explore Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureLaunchBanner;