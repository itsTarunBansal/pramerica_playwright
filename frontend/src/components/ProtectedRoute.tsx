import { Navigate } from "react-router-dom";
import { getSession } from "../auth/authService";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return getSession() ? <>{children}</> : <Navigate to="/login" replace />;
}
