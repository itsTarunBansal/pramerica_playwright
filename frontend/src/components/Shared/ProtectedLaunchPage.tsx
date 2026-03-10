import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import FeatureLaunchPage from './FeatureLaunchPage';
import SecureStorage from '../../utils/SecureStorage';

const ProtectedLaunchPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const user: any = SecureStorage.getItem('user');
  const authorizedUser :any= ['P037343']
  console.log(user, '--->authorized User', authorizedUser)
  // Check if user has lanId - only these users can see the launch page
  if (!authorizedUser.includes(user?.id)) {
    // Redirect to normal dashboard flow for users without lanId
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  
  return <FeatureLaunchPage userRole={role || ''} />;
};

export default ProtectedLaunchPage;