// src/pages/Unauthorized.jsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import PageTracker from "../components/PageTracker";

export default function Unauthorized() {
  const { user, authStatus } = useAuth();
  const [, setLocation] = useLocation();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <PageTracker page="Unauthorized"/>
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Unauthorized Access</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {isLoggedIn
              ? "You are logged in, but you do not have permission to view this page."
              : "You need to sign in with appropriate credentials to access this page."}
          </p>

          <div className="mt-6 flex justify-center gap-4">
            {isLoggedIn ? (
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                onClick={() => setLocation("/")} // go back to home
              >
                Go Back
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
                onClick={() => setLocation("/signin")}
              >
                Go to Sign In
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
