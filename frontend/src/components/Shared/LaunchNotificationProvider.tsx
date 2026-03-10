import React from 'react';
import { useLaunchNotifications } from '../../hooks/useLaunchNotifications';
import LaunchModal from './LaunchModal';

const LaunchNotificationProvider: React.FC = () => {
  const { launchData, clearLaunchData } = useLaunchNotifications();

  const transformedData = launchData ? {
    type: 'LAUNCH_COUNTDOWN_STARTED' as const,
    moduleName: launchData.plan?.title || 'New Module',
    version: '1.0.0',
    description: launchData.plan?.description || 'Module launch in progress',
    countdownDuration: launchData.countdown || launchData.plan?.countdownDuration
  } : null;

  return (
    // <LaunchModal
    //   isOpen={!!launchData}
    //   onClose={clearLaunchData}
    //   data={transformedData}
    // />
    <></>
  );
};

export default LaunchNotificationProvider;
