import { jwtDecode } from 'jwt-decode';
import SecureStorage from './SecureStorage';
export const setLoginData = (accessToken: string, refreshToken: string, user: any) => {
  const decoded: any = jwtDecode(accessToken);
  
  console.log('User object:', user);
  console.log('User fullName:', user?.fullName);

  SecureStorage.setItem('token', accessToken);
  SecureStorage.setItem('user', user);
  SecureStorage.setItem('firstName', decoded && decoded?.firstName);
  SecureStorage.setItem('lastName', decoded && decoded?.lastName);
  SecureStorage.setItem('username', decoded && decoded?.username);
  SecureStorage.setItem('fullName', user?.fullName);
  SecureStorage.setItem('refreshToken', refreshToken);
  
};

export const clearLoginData = () => {
  SecureStorage.removeItem('token');
  SecureStorage.removeItem('refreshToken');
};

export const getUserToken = () => {
  SecureStorage.getItem('token');
};
