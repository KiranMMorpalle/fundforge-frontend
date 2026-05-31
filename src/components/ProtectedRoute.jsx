import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-full"><span className="spinner" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/campaigns" replace />;
  return children;
}
