import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, ModalDialog, LinearProgress } from '@mui/joy';
import { Rocket, CheckCircle } from '@mui/icons-material';
 
interface PresentationLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchComplete: () => void;
  data: {
    moduleName: string;
    version: string;
    description: string;
    countdownDuration: number;
    remainingTime?: number;
    completed?: boolean;
  } | null;
}
 
const PresentationLaunchModal: React.FC<PresentationLaunchModalProps> = ({
  isOpen,
  onClose,
  onLaunchComplete,
  data
}) => {
  const [countdown, setCountdown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLaunched, setIsLaunched] = useState(false);
 
  useEffect(() => {
    if (!data || !isOpen) return;
 
    // Use external countdown if available, otherwise use internal
    if (data.remainingTime !== undefined) {
      setCountdown(data.remainingTime);
      setProgress(((data.countdownDuration - data.remainingTime) / data.countdownDuration) * 100);
     
      // Check if completed
      if (data.completed) {
        setIsLaunched(true);
        setProgress(100);
        setCountdown(0);
        // Don't auto-close, let user close manually
        return;
      }
     
      // Don't start internal countdown if we have external updates
      return;
    }
 
    // Fallback to internal countdown for admin preview
    setCountdown(data.countdownDuration);
    setProgress(0);
    setIsLaunched(false);
 
    const interval = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev - 1;
        setProgress(((data.countdownDuration - newCount) / data.countdownDuration) * 100);
       
        if (newCount <= 0) {
          console.log('🎉 Launch completed via internal countdown');
          clearInterval(interval);
          setIsLaunched(true);
          onLaunchComplete();
          return 0;
        }
        return newCount;
      });
    }, 1000);
 
    return () => clearInterval(interval);
  }, [data, isOpen, onLaunchComplete, data?.remainingTime, data?.completed]);
 console.log('🚀 PresentationLaunchModal render:', { isOpen, data, countdown, progress, isLaunched });
  if (!data) return null;
 
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: '90vw', sm: 400, md: 450 },
          maxWidth: 500,
          maxHeight: '90vh',
          p: { xs: 1.5, sm: 2 },
          textAlign: 'center',
          background: isLaunched
            ? 'linear-gradient(135deg, #001f45 0%, #003366 50%, #004080 100%)'
            : 'linear-gradient(135deg, #2D1B69 0%, #11998E 100%)',
          color: 'white',
          overflow: 'auto',
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: '50%',
            background: isLaunched
              ? 'linear-gradient(135deg, #FFD700, #FFA500)'
              : 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
            mx: 'auto',
            width: 'fit-content',
          }}
        >
          {isLaunched ? (
            <CheckCircle sx={{ fontSize: '32px', color: '#001f45' }} />
          ) : (
            <Rocket sx={{ fontSize: '32px', color: 'white' }} />
          )}
        </Box>
 
        {/* Title */}
        <Typography
          level="h3"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 1,
            fontSize: '1.2rem',
          }}
        >
          {isLaunched ? '🎉 Launch Successful!' : '🚀 Module Launching Soon!'}
        </Typography>
 
        {/* Success Message */}
        {isLaunched && (
          <Typography
            level="body-sm"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              mb: 1,
              fontSize: '0.9rem',
            }}
          >
            ✨ Module has been successfully launched! ✨
          </Typography>
        )}
 
        {/* Module Info */}
        <Typography
          level="h4"
          sx={{
            color: '#FFD700',
            fontWeight: 'bold',
            mb: 0.5,
            fontSize: '1.1rem',
          }}
        >
          {data.moduleName} {data.version}
        </Typography>
 
        <Typography
          level="body-sm"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 2,
            lineHeight: 1.4,
            fontSize: '0.85rem',
          }}
        >
          {data.description}
        </Typography>
 
        {/* Countdown Section */}
        {!isLaunched && countdown > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              level="h1"
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                fontSize: '2rem',
                mb: 0.5,
              }}
            >
              {countdown}
            </Typography>
            <Typography level="body-xs" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              seconds remaining
            </Typography>
            <LinearProgress
              determinate
              value={progress}
              sx={{
                '--LinearProgress-thickness': '6px',
                '--LinearProgress-progressColor': '#FFD700',
              }}
            />
          </Box>
        )}
 
        {/* Success Display */}
        {isLaunched && (
          <Box sx={{ mb: 2 }}>
            <Typography
              level="h2"
              sx={{
                color: '#00FF00',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                mb: 0.5,
              }}
            >
              ✅ COMPLETE!
            </Typography>
            <Typography level="body-xs" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Click outside or close button to continue
            </Typography>
            <LinearProgress
              determinate
              value={100}
              sx={{
                '--LinearProgress-thickness': '6px',
                '--LinearProgress-progressColor': '#00FF00',
              }}
            />
          </Box>
        )}
 
        {/* Launch Complete Message */}
        {isLaunched && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              level="body-sm"
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                mb: 1,
                fontSize: '0.85rem',
              }}
            >
              ✨ The module is now available in your dashboard!
            </Typography>
          </Box>
        )}
 
        {/* Action Button */}
        <Button
          onClick={onClose}
          size="sm"
          sx={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#001f45',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            fontSize: '0.9rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #FFA500, #FFD700)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
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
 
export default PresentationLaunchModal;
 