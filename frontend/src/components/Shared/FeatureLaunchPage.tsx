import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { AdminPanelSettings, Rocket } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { webSocketService } from '../../services/websocket.service';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';

interface FeatureLaunchPageProps {
  userRole: string;
}

const FeatureLaunchPage: React.FC<FeatureLaunchPageProps> = ({ userRole }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showContent, setShowContent] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [rocketExit, setRocketExit] = useState(false);
  const [socketLaunchData, setSocketLaunchData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  // WebSocket listener for launch notifications
  useEffect(() => {
    const handleLaunchNotification = (data: any) => {
      console.log('🔔 Launch notification received:', data);
      if (data.type === 'launch_countdown' || data.type === 'launch_completed') {
        setSocketLaunchData(data);
      }
    };

    webSocketService.on('notification', handleLaunchNotification);

    return () => {
      webSocketService.off('notification', handleLaunchNotification);
    };
  }, []);

  // Handle WebSocket launch data
  useEffect(() => {
    if (socketLaunchData && isLaunching) {
      if (socketLaunchData.type === 'launch_countdown' && socketLaunchData.remainingTime !== undefined) {
        setCountdown(socketLaunchData.remainingTime);
      } else if (socketLaunchData.type === 'launch_completed' || socketLaunchData.completed) {
        setIsLaunched(true);
        setShowConfetti(true);
        setRocketExit(true);
      }
    }
  }, [socketLaunchData, isLaunching]);

  // Handle redirection when launch is completed
  useEffect(() => {
    if (isLaunched) {
      const timer = setTimeout(() => {
        console.log('Redirecting to dashboard after launch completion');
        localStorage.setItem('adminTicketFeatureLaunched', 'true');
        // navigate(`/dashboard/${userRole}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLaunched, userRole, navigate]);

  // Fallback local countdown if WebSocket fails
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLaunching && countdown > 0 && !socketLaunchData) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isLaunching && countdown === 0 && !isLaunched && !socketLaunchData) {
      setIsLaunched(true);
      setShowConfetti(true);
      setRocketExit(true);
    }
    return () => clearTimeout(timer);
  }, [isLaunching, countdown, isLaunched, socketLaunchData]);

  const handleLaunch = async () => {
    setIsLaunching(true);

    const launchData = {
      title: 'Admin Request Management System',
      description: 'Streamline your administrative processes with our new comprehensive ticket management system. Raise requests, track progress, and manage approvals all in one place.',
      targetRoles: ['BSUser', 'BSAdmin', 'ROM'],
      countdownDuration: 10,
      createdBy: 'system'
    };

    try {
      // Create launch plan
      const createResponse = await fetch(`${process.env.REACT_APP_API_PATH}api/release/create-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(launchData),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create launch plan');
      }

      const createResult = await createResponse.json();
      console.log('✅ Launch plan created:', createResult);

      // Start countdown
      const startResponse = await fetch(`${process.env.REACT_APP_API_PATH}api/release/start-countdown/${createResult.data.id}`, {
        method: 'POST',
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start countdown');
      }

      const startResult = await startResponse.json();
      console.log('🚀 Launch started:', startResult);

    } catch (error) {
      console.error('❌ Launch failed:', error);
      // Continue with local countdown even if API fails
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #001f45 0%, #003366 50%, #0066cc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              zIndex: 10000,
              overflow: 'hidden'
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: Math.random() * 12 + 6,
                  height: Math.random() * 12 + 6,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 8)],
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  animation: `confettiFall ${3 + Math.random() * 4}s linear forwards`,
                  animationDelay: `${Math.random() * 3}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  '@keyframes confettiFall': {
                    '0%': {
                      transform: 'translateY(-20px) rotate(0deg)',
                      opacity: 1
                    },
                    '100%': {
                      transform: `translateY(100vh) rotate(${720 + Math.random() * 360}deg)`,
                      opacity: 0
                    }
                  }
                }}
              />
            ))}
          </Box>
          {/* Flying Rocket */}
          <Rocket
            sx={{
              position: 'fixed',
              fontSize: '48px',
              color: '#FFD700',
              zIndex: 10001,
              animation: 'rocketFly 3s ease-out forwards',
              '@keyframes rocketFly': {
                '0%': {
                  bottom: '10%',
                  right: '10%',
                  transform: 'rotate(-45deg) scale(1)',
                  opacity: 1
                },
                '100%': {
                  bottom: '90%',
                  right: '90%',
                  transform: 'rotate(-45deg) scale(2)',
                  opacity: 0.3
                }
              }
            }}
          />
        </>
      )}

      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          }
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '800px',
          padding: { xs: '20px', sm: '30px' },
          transform: showContent ? 'translateY(0)' : 'translateY(50px)',
          opacity: showContent ? 1 : 0,
          transition: 'all 1s ease-out',
          maxHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Company Logo Area */}
        <Box sx={{ mb: 4 }}>
          <Typography
            level="h4"
            sx={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            Pramerica Life Insurance
          </Typography>
          <Box
            sx={{
              width: '100px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, white, transparent)',
              margin: '0 auto',
            }}
          />
        </Box>

        {/* Feature Icon */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              p: 4,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: showContent ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
                '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 20px rgba(255, 255, 255, 0)' },
              }
            }}
          >
            <AdminPanelSettings sx={{ fontSize: '32px', color: 'white' }} />
            {/* <Rocket
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: rocketExit ? '64px' : isLaunching ? '32px' : '24px',
                color: '#FFD700',
                transformOrigin: 'center',
                animation: rocketExit ? 'rocketExit 2s ease-in forwards' :
                  isLaunching ? 'rocketCircleAnticlockwise 2s linear infinite' :
                    showContent ? 'rocket 3s ease-in-out infinite' : 'none',
                transition: 'font-size 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
               '@keyframes rocket': {
                  '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
                  '25%': { transform: 'translate(5px, -5px) rotate(15deg)' },
                  '75%': { transform: 'translate(-5px, 5px) rotate(-15deg)' },
                },
                // '@keyframes rocketCircleAnticlockwise': {
                //   '0%': { transform: 'translate(-50%, -50%) translate(120px, 0px) rotate(-45deg)' },
                //   '12.5%': { transform: 'translate(-50%, -50%) translate(85px, -85px) rotate(-45deg)' },
                //   '25%': { transform: 'translate(-50%, -50%) translate(0px, -120px) rotate(-45deg)' },
                //   '37.5%': { transform: 'translate(-50%, -50%) translate(-85px, -85px) rotate(-45deg)' },
                //   '50%': { transform: 'translate(-50%, -50%) translate(-120px, 0px) rotate(-45deg)' },
                //   '62.5%': { transform: 'translate(-50%, -50%) translate(-85px, 85px) rotate(-45deg)' },
                //   '75%': { transform: 'translate(-50%, -50%) translate(0px, 120px) rotate(-45deg)' },
                //   '87.5%': { transform: 'translate(-50%, -50%) translate(85px, 85px) rotate(-45deg)' },
                //   '100%': { transform: 'translate(-50%, -50%) translate(120px, 0px) rotate(-45deg)' },
                // },
                '@keyframes rocketExit': {
                  '0%': { transform: 'translate(-50%, -50%) translate(120px, 0px) rotate(-45deg) scale(1.2)', opacity: 1 },
                  '100%': { transform: 'translate(-50%, -50%) translate(-200px, -200px) rotate(-45deg) scale(0.5)', opacity: 0 }
                }
              }}
            /> */}

           
          </Box>
        </Box>

        {/* Title */}
        <Typography
          level="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            background: isLaunched ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, white, #e3f2fd)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: isLaunched ? 'celebrate 1s ease-in-out' : 'none',
            '@keyframes celebrate': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' }
            }
          }}
        >
          {isLaunched ? '🎉 Congratulations!' : isLaunching ? `Launching in ${countdown}` : 'New Feature Launch'}
        </Typography>

        {/* Feature Name */}
        <Typography
          level="h2"
          sx={{
            color: isLaunched ? '#FFD700' : '#e3f2fd',
            fontWeight: 600,
            mb: 3,
            fontSize: { xs: '1.5rem', md: '2rem' },
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          {isLaunched ? 'New Module is Launched!' : 'Admin Request Management System'}
        </Typography>

        {/* Description */}
        {!isLaunching && !isLaunched && (
          <>
            {/* <Typography
              level="body-lg"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                maxWidth: '600px',
                margin: '0 auto 32px auto',
                lineHeight: 1.8,
                fontSize: '1.1rem',
              }}
            >
              Streamline your administrative processes with our new comprehensive ticket management system.
              Raise requests, track progress, and manage approvals all in one place.
            </Typography> */}

            {/* Features List */}
            {/* <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 5,
                maxWidth: '700px',
                margin: '0 auto 40px auto',
              }}
            >
              {[
                { icon: '🎯', title: 'Easy Request Creation', desc: 'Simple form-based ticket creation' },
                { icon: '📊', title: 'Real-time Tracking', desc: 'Monitor request status instantly' },
                { icon: '⚡', title: 'Fast Approvals', desc: 'Streamlined approval workflow' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                    transform: showContent ? 'translateY(0)' : 'translateY(30px)',
                    opacity: showContent ? 1 : 0,
                    transition: `all 1s ease-out ${index * 0.2}s`,
                  }}
                >
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>{feature.icon}</Typography>
                  <Typography level="title-md" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {feature.desc}
                  </Typography>
                </Box>
              ))}
            </Box> */}
          </>
        )}

        {/* Launch Status */}
        {isLaunching && !isLaunched && (
          <Typography
            level="body-lg"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              fontSize: '1.2rem',
              textAlign: 'center',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            🚀 Preparing to launch your new admin system...
          </Typography>
        )}

        {/* Success Message */}
        {isLaunched && (
          <>
            <Typography
              level="body-lg"
              sx={{
                color: '#FFD700',
                mb: 4,
                maxWidth: '600px',
                margin: '0 auto 32px auto',
                lineHeight: 1.8,
                fontSize: '1.3rem',
                fontWeight: 600,
                textAlign: 'center',
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(30px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              🎆 Your Admin Request Management System is now live and ready to use!
            </Typography>
            <Button
              onClick={() => navigate(`/dashboard/${userRole}`)}
              size="lg"
              sx={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#001f45',
                fontWeight: 'bold',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: '50px',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500, #FFD700)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(255, 215, 0, 0.6)',
                },
                transition: 'all 0.3s ease',
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  '0%': { boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)' },
                  '100%': { boxShadow: '0 8px 32px rgba(255, 215, 0, 0.8)' },
                }
              }}
            >
              🚀 Go to Dashboard
            </Button>
          </>
        )}

        {/* Launch Button */}
        {!isLaunching && !isLaunched && (
          <Button
            onClick={handleLaunch}
            size="lg"
            sx={{
              background: 'linear-gradient(135deg, white, #e3f2fd)',
              color: '#001f45',
              fontWeight: 'bold',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: '50px',
              boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f5f5f5, #bbdefb)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 40px rgba(255, 255, 255, 0.4)',
              },
              transition: 'all 0.3s ease',
              animation: showContent ? 'glow 2s ease-in-out infinite alternate' : 'none',
              '@keyframes glow': {
                '0%': { boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)' },
                '100%': { boxShadow: '0 8px 32px rgba(255, 255, 255, 0.6)' },
              }
            }}
          >
            🚀 Launch Feature
          </Button>
        )}

        {/* Footer */}
        <Typography
          level="body-xs"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            mt: 4,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Powered by Sashakt Platform
        </Typography>
      </Box>
    </Box>
  );
};

export default FeatureLaunchPage;