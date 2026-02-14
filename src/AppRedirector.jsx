import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function AppRedirector() {
  const { authStatus, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (authStatus === "authenticated" && user) {
      if (user.role === "landlord") {
        setLocation("/landlord-dashboard");
      } else if (user.role === "comrade") {
        setLocation("/");
      } else {
        setLocation("/listings");
      }
    }
  }, [authStatus, user, setLocation]);

  return null; // this component just redirects
}
