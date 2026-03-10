import { RootState } from '../../redux/store';

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthSuccessMessage = (state: RootState) =>
  state.auth.successMessage;
export const selectShortProfile = (state: RootState) => state.auth.profile;
