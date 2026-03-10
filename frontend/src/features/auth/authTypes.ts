export interface UserType {
  username: string;
  userGroup: string[];
  isBlocked: boolean;
  role: string;
  userRole: string;
}

export interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean; // Indicates if the user is logged in
  loading: boolean; // Loading state for authentication actions
  error: string | null; // Error message, null if no error
  successMessage: string | null; // Success message, e.g., for password reset
  profile: Record<string, any> | null; // Additional profile details, if available
}

// Initial state for the auth slice
export const initialState: AuthState = {
  user: null, // Initially, no user is logged in
  accessToken: null, // No access token initially
  refreshToken: null, // No refresh token initially
  isLoggedIn: false, // User is not logged in by default
  loading: false, // Not loading initially
  error: null, // No error initially
  successMessage: null, // No success message initially
  profile: null, // No profile details initially
};

// LoginPayload defines the structure of the login payload
export interface LoginPayload {
  username: string; // Username for login
  password: string; // Password for login
}
