// src/RoleRouter.jsx
import { Redirect } from "wouter";
import { useAuth } from "./contexts/AuthContext";

export default function RoleRouter() {
  const { user } = useAuth();

  if (!user) return <Redirect to="/signin" />;

  if (user.role === "landlord") {
    return <Redirect to="/landlord-dashboard" />;
  }
  if (user.role === "comrade") {
    return <Redirect to="/" />;
  }

  return <Redirect to="/listings" />;
}

