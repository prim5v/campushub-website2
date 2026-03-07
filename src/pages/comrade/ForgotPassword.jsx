// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { ApiSocket } from "@/utils/ApiSocket";
import * as Sentry from "@sentry/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const res = await ApiSocket.post("/auth/forgot_password", { email });
      setStatus({
        loading: false,
        message: res.message || "Check your email for reset instructions.",
        error: false,
      });
    } catch (err) {
      setStatus({
        loading: false,
        message: err.message || "Failed to send reset email.",
        error: true,
      });
      Sentry.captureException(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 flex justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link.
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
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full h-12" disabled={status.loading}>
                {status.loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}