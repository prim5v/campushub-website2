import { useState, useEffect } from "react";
import { useSearchParams, useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApiSocket } from "@/utils/ApiSocket";
import { Toaster } from "@/components/ui/toaster";
import { Eye, EyeOff } from "lucide-react";
import * as Sentry from "@sentry/react";
import { Player } from "@lottiefiles/react-lottie-player";
import NotFoundAnimation from "../../../assets/lottie/404.json";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [, setLocation] = useLocation();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ loading: true, message: "", error: false });
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, message: "No token provided.", error: true });
      return;
    }

    const checkToken = async () => {
      try {
        const res = await ApiSocket.post("/auth/check_token", { token });
        if (res.valid) {
          setTokenValid(true);
          setStatus({ loading: false, message: "", error: false });
        } else {
          setStatus({ loading: false, message: "Token expired or invalid.", error: true });
        }
      } catch (err) {
        Sentry.captureException(err);
        setStatus({ loading: false, message: err.message || "Failed to verify token.", error: true });
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setStatus({ loading: false, message: "Please fill out both fields.", error: true });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ loading: false, message: "Passwords do not match.", error: true });
      return;
    }

    setStatus({ loading: true, message: "", error: false });
    try {
      await ApiSocket.post("/auth/reset_password", { token, password });
      setStatus({
        loading: false,
        message: "Password reset successfully. Redirecting to sign in...",
        error: false,
      });
      setTimeout(() => setLocation("/signin"), 3000);
    } catch (err) {
      Sentry.captureException(err);
      setStatus({ loading: false, message: err.message || "Failed to reset password.", error: true });
    }
  };

  // Render loading / invalid token states
  if (status.loading && !tokenValid) return <div className="pt-32 text-center">Checking token...</div>;
 if (!token || !tokenValid) {
  return (
    <div className="pt-16 text-center flex flex-col items-center justify-center min-h-screen">
      <Player
        autoplay
        loop
        src={NotFoundAnimation}
        style={{ height: 300, width: 300 }}
      />
      <h2 className="text-xl font-semibold mt-4">{status.message}</h2>
      <Link href="/forgot-password" className="text-primary hover:underline mt-4 inline-block">
        Request a new reset link
      </Link>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 flex justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to reset your account.
            </p>
          </CardHeader>

          <CardContent>
            {status.message && (
              <div
                className={`mb-4 rounded-md p-3 text-center ${
                  status.error
                    ? "border border-red-500 bg-red-50 text-red-600"
                    : "border border-green-500 bg-green-50 text-green-600"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label="Toggle confirm password visibility"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full h-12" disabled={status.loading}>
                {status.loading ? "Resetting..." : "Reset Password"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}