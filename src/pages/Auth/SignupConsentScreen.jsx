import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import * as Sentry from "@sentry/react";
import ApiSocket from "@/utils/ApiSocket";
import PageTracker from "../../components/PageTracker";

export default function SignupConsentPage() {
  const { signupPayload, setAuthStatus, remove, pendingEmail } = useAuth();

  const [phone, setPhone] = useState("");
  const [agreedManual, setAgreedManual] = useState(false);
  const [agreedEmail, setAgreedEmail] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [madeRequest, setMadeRequest] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  // if (!signupPayload?.email || !pendingEmail) {
  //   setError("Signup email is missing. Please restart the signup process.");
  //   return;
  // }

  if (!agreedManual || !agreedEmail || !phone) {
    setError("Please fill all required fields and consents.");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    setMessage(null);

// const payload = {
//   email: signupPayload?.email || pendingEmail,
//   ...signupPayload,
//   consent_manual: agreedManual,
//   consent_email_valid: agreedEmail,
//   phone_number: phone,
// };
const payload = {
  email: signupPayload?.email || pendingEmail,
  consent_manual: agreedManual,
  consent_email_valid: agreedEmail,
  phone_number: phone,
};

    console.log("Sending payload:", payload);

    const response = await ApiSocket.post("/auth/manual_create_account", payload);

    // console.log("Response received:", response.data);

    if (response.message) {
      setMessage(response.message);
    }
    console.log("Response received:", response);
    setMadeRequest(true)

    // setTimeout(() => setAuthStatus("unauthenticated"), 2000);
  } catch (err) {
    console.error("API error:", err);
    Sentry.captureException(err);
    const backendError =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.error ||
    err?.message;

    console.log(backendError)


    if (backendError) {
      setError(backendError);
    } else {
      setError("Manual account creation request failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    remove();
  };

  if (madeRequest) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Request Received</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Your manual account creation request has been successfully recorded.
          </p>

          <p className="text-muted-foreground">
            Our team will create your account and contact you using the phone
            number you provided.
          </p>

          <Button
            className="w-full"
            onClick={handleCancel}
          >
            Return to Login
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() =>
              window.open(
                "https://chat.whatsapp.com/JklFu1JtRplJrEqE3SOCob?mode=gi_t",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Join WhatsApp Community
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageTracker page="Sign up Consent-Screen"/>
      <div className="pt-32 pb-20 flex justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Manual Account Creation</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              We couldn’t send your verification email due to temporary technical
              issues. If you consent, we can manually create your account and
              provide your credentials later. Please provide your phone number so
              we can reach you.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">

            {message && (
              <div className="mb-4 rounded-md border border-green-500 bg-green-50 p-3 text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreedManual}
                  onChange={(e) => setAgreedManual(e.target.checked)}
                  required
                />
                <span>I consent to having my account manually created</span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreedEmail}
                  onChange={(e) => setAgreedEmail(e.target.checked)}
                  required
                />
                <span>I confirm that the email I provided is valid</span>
              </div>

              <Button className="w-full h-12" disabled={loading}>
                {loading ? "Submitting..." : "Submit & Create Account"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-red-500"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Join our WhatsApp community of new CampusHub members for updates,
                tips, and support:
              </p>

              <Button
                className="w-full"
                onClick={() =>
                  window.open(
                    "https://chat.whatsapp.com/JklFu1JtRplJrEqE3SOCob?mode=gi_t",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Join WhatsApp Community
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}