import React from 'react';
import { roles, roleList } from './userRole';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authActions'; // Adjust import path as necessary
import { AppDispatch } from '../../redux/store';
import { Navigate } from 'react-router-dom';

interface CheckRolesProps {
  role: string;
  path: string;
  query: string;
}

const CheckRoles: React.FC<CheckRolesProps> = ({ role, path, query }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Find the matched role from the roles array
  const matchedRole = roles.find((item) => item.role === role);

  // Determine the target path
  const targetPath =
    path.split('/').length === 2
      ? `/dashboard/${
          roleList.includes(matchedRole?.url || '')
            ? matchedRole?.url
            : matchedRole
              ? matchedRole.url
              : 'Error'
        }`
      : path;

  // Redirect based on the resolved target path
  if (targetPath !== '/dashboard/') {
    return <Navigate to={`${targetPath}${query}`} replace />;
  } else {
    dispatch(logout());
    window.location.replace('/');
    return <Navigate to="/" replace />;
  }
};

export default CheckRoles;
