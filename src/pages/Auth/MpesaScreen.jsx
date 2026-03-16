import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, AUTH } from "../../contexts/AuthContext";
import PageTracker from "../../components/PageTracker";

export default function MpesaScreen({ onBack }) {
  const { logout, paymentstatusCheck, mpesaMessage, mpesaStatus, checkoutId } = useAuth();
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  /* ---------------- AUTO CANCEL ---------------- */
  useEffect(() => {
    if (timeLeft === 0) {
      console.warn("[MPESA] Time elapsed — cancelling payment");
      handleCancel();
    }
  }, [timeLeft]);

  /* ---------------- POLL PAYMENT STATUS ---------------- */
  useEffect(() => {
    if (!checkoutId) return;

    const interval = setInterval(async () => {
      try {
        await paymentstatusCheck(checkoutId);
      } catch (err) {
        console.error("[MPESA] Payment status polling error:", err);
      }
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  }, [checkoutId]);

  const handleCancel = () => {
    logout();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  /* ---------------- CONDITIONAL SCREENS ---------------- */
  if (mpesaStatus === "failed") {
    return (
      <Card className="max-w-md mx-auto mt-10 p-6">
        <CardHeader className="space-y-3">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to payment details
          </button>
          <CardTitle>Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <XCircle className="w-10 h-10 text-red-600" />
          <p className="text-center text-muted-foreground">{mpesaMessage}</p>
          <Button onClick={handleCancel} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mpesaStatus === "paid") {
    return (
      <Card className="max-w-md mx-auto mt-10 p-6">
        <CardHeader className="space-y-3">
          <CardTitle>Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
          <p className="text-center text-muted-foreground">{mpesaMessage}</p>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- DEFAULT MPESA PAYMENT SCREEN ---------------- */
  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <PageTracker page="Mpesa screen"/>
      <CardHeader className="space-y-3">
        {/* BACK */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to payment details
        </button>

        <CardTitle>To complete your purchase</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* STEP 1 */}
        <div className="flex gap-4">
          <MessageSquare className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Wait for an M-Pesa message</p>
            <p className="text-sm text-muted-foreground">
              A payment request will appear on your phone shortly.
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex gap-4">
          <ShieldCheck className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Approve the payment</p>
            <p className="text-sm text-muted-foreground">
              Enter your M-PESA PIN when prompted to authorize the payment.
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex gap-4">
          <RefreshCcw className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-medium">Wait for confirmation</p>
            <p className="text-sm text-muted-foreground">
              We’ll automatically confirm once your payment is successful.
            </p>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="flex flex-col items-center pt-6 gap-2">
          <Clock className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Time remaining to complete payment
          </p>
          <p className="text-lg font-semibold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
