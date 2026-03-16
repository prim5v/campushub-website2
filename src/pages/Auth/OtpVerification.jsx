import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import * as Sentry from "@sentry/react";
import PageTracker from "../../components/PageTracker";

export default function OtpVerification() {
  const {
    verifyOtp,
    remove,
    signup,
    authStatus,
    error,
    pendingEmail,
    signupPayload,
  } = useAuth();

  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const canResend = resendTimer === 0;

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------- GUARDS ---------------- */
  if (!pendingEmail) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) return;

    try {
      setLoading(true);
      await verifyOtp({ otp });
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!signupPayload || resendTimer > 0) return; // prevent multiple clicks

    setResendTimer(60); // restart timer
    setLoading(true);

    try {
      await signup(signupPayload);
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    remove();
  };

  /* ---------------- UI ---------------- */
  return (
    <Card className="max-w-md mx-auto mt-10 p-6" id="otp-screen">
      <PageTracker page="OTP verification"/>
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to <strong>{pendingEmail}</strong>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          onClick={handleVerifyOtp}
          disabled={loading || otp.length < 4}
          className="w-full"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* RESEND */}
        <div className="flex justify-between items-center text-sm">
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`underline ${
              canResend && !loading ? "text-blue-600" : "text-gray-400"
            }`}
          >
            Resend OTP
          </button>

          {!canResend && (
            <span className="text-gray-500">Resend in {resendTimer}s</span>
          )}
        </div>

        {/* CANCEL */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="w-full text-red-500"
        >
          Cancel Signup
        </Button>
      </CardContent>
    </Card>
  );
}