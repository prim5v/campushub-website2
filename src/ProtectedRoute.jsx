// src/components/ProtectedRoute.jsx
import { Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authStatus } = useAuth();

  if (authStatus === "loading") return null; // or a loading spinner
  if (!user) return <Redirect to="/signin" />; // not logged in
  if (!allowedRoles.includes(user.role)) return <Redirect to="/unauthorized" />;

  return children; // user has access
}
