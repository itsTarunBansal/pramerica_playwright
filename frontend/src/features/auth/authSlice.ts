import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './authTypes';
import {
  loginMe,
  adloginMe,
  forgotPassword,
  passwordResetConfirm,
  changePassword,
  getShortProfile,
  checkUser,
} from './authActions';
import { clearLoginData } from '../../utils/storage';
import SecureStorage from '../../utils/SecureStorage';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      SecureStorage.removeItem('token');
      SecureStorage.removeItem('refreshToken');
      SecureStorage.removeItem('active_tab');
      window.location.href='/';
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginMe.fulfilled,
        (
          state,
          action: PayloadAction<{ access_token: string; refreshToken: string }>,
        ) => {
          state.loading = false;
          state.accessToken = action.payload.access_token;
          state.refreshToken = action.payload.refreshToken;
          state.isLoggedIn = true;
        },
      )
      .addCase(loginMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // AD Login Cases
      .addCase(adloginMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adloginMe.fulfilled,
        (
          state,
          action: PayloadAction<{ access_token: string; refreshToken: string }>,
        ) => {
          state.loading = false;
          state.accessToken = action.payload.access_token;
          state.refreshToken = action.payload.refreshToken;
          state.isLoggedIn = true;
        },
      )
      .addCase(adloginMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkUser.fulfilled,
        (state, action: PayloadAction<{ user: any } | null>) => {
          state.loading = false;
          if (action.payload?.user) {
            state.user = action.payload.user;
            state.isLoggedIn = true;
          } else {
            state.user = null;
            state.isLoggedIn = false;
          }
        },
      )
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        },
      )
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Password Reset Confirmation Cases
      .addCase(passwordResetConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        passwordResetConfirm.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        },
      )
      .addCase(passwordResetConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Password Cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        },
      )
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Short Profile Cases
      .addCase(getShortProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getShortProfile.fulfilled,
        (state, action: PayloadAction<Record<string, any>>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(getShortProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
