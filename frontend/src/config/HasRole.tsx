import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure this is the default import
import SecureStorage from '../utils/SecureStorage';

interface HasRoleProps {
  children: React.ReactNode;
  role: string;
}

const HasRole: React.FC<HasRoleProps> = ({ children, role }) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const fetchToken = urlParams.get('token');

  if (fetchToken) {
    SecureStorage.setItem('token', fetchToken);
  }

  const token:any = SecureStorage.getItem('token');

  if (!token) {
    // Redirect to home if no token exists
    return <Navigate to="/" replace />;
  }

  try {
    // Decode the token and extract the user's role
    const decoded: { role?: string; userRole?: string } = jwtDecode(token);
    const userRole = decoded.userRole || decoded.role;
console.log(userRole, '===>userRole', role);
    if (userRole !== role) {
      // Redirect to dashboard if roles don't match
      return <Navigate to="/dashboard" replace />;
    }

    // Render the children if roles match
    return <>{children}</>;
  } catch (error) {
    console.error('Token decoding failed', error);
    // Redirect to home if token decoding fails
    return <Navigate to="/" replace />;
  }
};

export default HasRole;
