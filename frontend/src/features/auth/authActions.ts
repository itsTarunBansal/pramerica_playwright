import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserToken, setLoginData } from '../../utils/storage';
import { AppThunk } from '../../redux/store';
import { logout as logoutAction } from './authSlice';
import { jwtDecode } from 'jwt-decode';
import {
  loginApi,
  adloginApi,
  forgotPasswordApi,
  passwordResetConfirmApi,
  changePasswordApi,
  getShortProfileApi,
} from '../../api/authApi';
import SecureStorage from '../../utils/SecureStorage';

const isTokenExpired = (decoded: any): boolean => {
  try {
    return decoded.exp < Date.now() / 1000; // Check if the token's expiration time is in the past
  } catch (error) {
    return true; // If there's an error, treat it as expired
  }
};

export const checkUser = createAsyncThunk(
  'auth/checkUser',
  async (_, { rejectWithValue }) => {
    try {
      const token: any = SecureStorage.getItem('token');
      if (!token) {
        return { user: null };
      }
      const decoded: any = jwtDecode(token);

      if (!isTokenExpired(decoded)) {
        const { username, userGroup, isBlocked, role, userRole } = decoded;
        return { user: { username, userGroup, isBlocked, role, userRole } };
      } else {
        return { user: null };
      }
    } catch (error: any) {
      return rejectWithValue('Failed to check user');
    }
  },
);

export const loginMe = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await loginApi({ username, password });
      setLoginData(response.access_token, response.refreshToken, response?.user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

export const adloginMe = createAsyncThunk(
  'auth/ad-login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adloginApi({ username, password });
      setLoginData(response?.data?.accessToken, response?.data?.refreshToken, response?.data?.user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'AD Login failed');
    }
  },
);
export const logout = (): AppThunk => async (dispatch) => {
  dispatch(logoutAction()); // Dispatch the logout slice action
  return Promise.resolve(); // Return a resolved promise to match the expected return type
};
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(email);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred',
      );
    }
  },
);

// Password Reset Confirmation
export const passwordResetConfirm = createAsyncThunk(
  'auth/passwordResetConfirm',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await passwordResetConfirmApi(data);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred',
      );
    }
  },
);

// Change Password
export const changePassword = createAsyncThunk(
  'auth/forgot-password',
  async (
    data: { oldPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await changePasswordApi(data);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred',
      );
    }
  },
);

// Get Short Profile
export const getShortProfile = createAsyncThunk(
  'auth/getShortProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getShortProfileApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred',
      );
    }
  },
);
