import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dash from '../containers/dash';
import SecureStorage from '../utils/SecureStorage';

const AuthenticatedRoutes = () => {
  const token: string | null = SecureStorage.getItem('token');
  console.log(token, '===>token');

  if (!token) {
    // Redirect to login if token is not found
    return <Navigate to="/" replace />;
  }

  // Capture path and query for Dash component
  const path = window.location.pathname;
  const query = window.location.search;

  return (
    <Routes>
      <Route path="/" element={<Dash path={path} query={query} />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;
