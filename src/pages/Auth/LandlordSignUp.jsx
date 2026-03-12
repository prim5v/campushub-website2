// src/pages/LandlordSignUp.jsx
import { useEffect, useState } from "react";
// import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Check } from "lucide-react";
import { ApiSocket } from "@/utils/ApiSocket";
import OtpVerification from "../Auth/OtpVerification";
import LoadingScreen from "../Auth/LoadingScreen"

import { useAuth } from "@/contexts/AuthContext";
import * as Sentry from "@sentry/react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Link } from "wouter";
/* ================= PAGE ================= */

export default function LandlordSignUp() {
  const { signup, mpesaSignup, error, authStatus } = useAuth();
  // const [plan, setPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({
    price: 0,
    name: "",
    period: "",
    description: "",
    features: [],
    notIncluded: []
  });
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [planerror, setPlanError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan");
  const [screen, setScreen] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  // possible values: "form", "otp", "mpesa", "creating", "success"



  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await ApiSocket.get(`/landlord/get_plan_details/${planId}`); // ✅ backticks + correct variable
        setSelectedPlan(data.plan || []); // assumes backend returns { plan: [...] }
        console.log("Fetched plan:", data);
        setPlanError(null);
      } catch (err) {
        console.error("Failed to fetch plan:", err);
        setPlanError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);


useEffect(() => {
  if (planerror === "Plan not found") {
    alert(
      "You haven’t selected a landlord plan yet. Please choose a plan to continue."
    );
    setLocation("/plans");
  }
}, [planerror]);






  /* ================= FORM STATE ================= */

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "landlord",
    acceptedTerms: false,
  });


  useEffect(() => {
    if (selectedPlan) {
      setPaymentMethod(selectedPlan.price === 0 ? "free" : "mpesa");
    }
  }, [selectedPlan]);

  const [mpesaPhone, setMpesaPhone] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  // this snippet code prevents user from staying on the landlord signup page after successful signup by checking authStatus and redirecting to landlord dashboard if authenticated
  // run useEffect user to landlord dashboard if authStatus changes to authenticated (after signup/login)
  useEffect(() => {
    if (authStatus === "authenticated") {
      setLocation("/landlord-dashboard");
    }
  }, [authStatus, setLocation]);

  const handleMpesaPhoneChange = (e) => {
  let value = e.target.value;

  // Remove non-numeric characters
  value = value.replace(/\D/g, '');

  // Convert 0XXXXXXXXX → 254XXXXXXXXX
  if (value.startsWith('0')) {
    value = '254' + value.slice(1);
  }

  // Allow only up to 12 digits (254 + 9 digits)
  if (value.length > 12) return;

  setMpesaPhone(value);
};


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  

  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   if(form.password != form.confirmPassword){
  //     alert("Passwords do not match");
  //     return;
  //   }

  //   const payload = {
  //     user: form,
  //     plan: selectedPlan,
  //     payment: {
  //       method: paymentMethod,
  //       mpesaPhone,
  //       card,
  //     },
  //   };

  //   if (selectedPlan.price === 0) {
  //     await signup(form);
  //     console.log("SUBMIT form:", form);
  //     // Free plan → show OTP verification screen
  //     // setScreen("otp");
  //   } else if (paymentMethod === "mpesa") {
  //     await mpesaSignup(payload)
  //     console.log("SUBMIT PAYLOAD:", payload);
  //     // Paid plan → show M-Pesa payment screen
  //     // setScreen("mpesa");
  //   }
  //   // alert("Signup + payment submitted (mock). Check console.");
  //   // alert("Error");
  // }
async function handleSubmit(e) {
  e.preventDefault();

  try {
    setLoading2(true);

    if (form.password != form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      user: form,
      plan: selectedPlan,
      payment: {
        method: paymentMethod,
        mpesaPhone,
        card,
      },
    };

    if (selectedPlan.price === 0) {
      await signup(form);
      console.log("SUBMIT form:", form);
      // setScreen("otp");
    } 
    else if (paymentMethod === "mpesa") {
      await mpesaSignup(payload);
      console.log("SUBMIT PAYLOAD:", payload);
      // setScreen("mpesa");
    }

  } catch (error) {
    console.error("Signup or payment failed:", error);
    alert(error?.message || "An error occurred during signup.");
  } finally {
    setLoading2(false);
  }
}
  




  /* ================= RENDER SCREENS ================= */
  if (loading) return <LoadingScreen/>;
  // if (error) return <p className="text-red-600">{error}</p>;
if (planerror && planerror !== "Plan not found") {
  return <p className="text-red-600">{planerror}</p>;
}




  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= LEFT: SIGNUP + PAYMENT ================= */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Create Landlord Account</CardTitle>
          </CardHeader>
          <CardContent>
            
            {/* best way of rendering error */}
              {error && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ===== Account ===== */}
              <div className="space-y-4">
                <Input name="username" placeholder="Full name" value={form.username} onChange={handleChange} required />
                <Input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
                <div className="relative">
                <Input name="password"
                  type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password} 
                    onChange={handleChange}
                      required />
                      <button
                      type="button"
                      onClick={()=> setShowPassword((prev) => !prev)}
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4"/>

                        ):(
                          <Eye className="h-4 w-4" />
                        )
                        }

                      </button>
                </div>
                <div>
                                  {/* <Label>Confirm Password</Label> */}
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={(e) =>
                                      setForm({ ...form, confirmPassword: e.target.value })
                                    }
                                    required
                                  />
                                </div>
                
                                <div className="flex items-start gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={form.acceptedTerms}
                                    onChange={(e) =>
                                      setForm({ ...form, acceptedTerms: e.target.checked })
                                    }
                                    required
                                  />
                
                                  <span>
                                    I agree to the{" "}
                                    <Link href="/terms-of-service" className="text-primary underline">
                                      Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy-policy" className="text-primary underline">
                                      Privacy Policy
                                    </Link>
                                  </span>
                                </div>
              </div>

              {/* ===== Payment Methods ===== */}
              {selectedPlan.price > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Payment Method</h3>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mpesa")}
                      className={`flex-1 border rounded-lg p-3 ${paymentMethod === "mpesa" ? "border-primary" : "border-border"
                        }`}
                    >
                      M-Pesa
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 border rounded-lg p-3 ${paymentMethod === "card" ? "border-primary" : "border-border"
                        }`}
                    >
                      Card
                    </button>
                  </div>

                  {/* ===== MPESA ===== */}
                  {paymentMethod === "mpesa" && (
                    <Input
                      placeholder="M-Pesa phone number (07xxxxxxxx)"
                      value={mpesaPhone}
                      onChange={handleMpesaPhoneChange}
                      required
                    />
                  )}

                  {/* ===== CARD ===== */}
                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} required />
                      <Input placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} required />
                      <Input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} required />
                      <Input placeholder="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} required />
                    </div>
                  )}
                </div>
              )}

             <Button
  type="submit"
  disabled={loading2}
  className="w-full h-12 text-lg"
>
  {loading2
    ? selectedPlan.price === 0
      ? "Creating Free Account..."
      : "Creating Account..."
    : selectedPlan.price === 0
    ? "Create Free Account"
    : "Pay & Create Account"}
</Button>
            </form>
          </CardContent>
        </Card>

        {/* ================= RIGHT: PLAN ================= */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-xl font-bold">{selectedPlan.name}</h3>
            <p className="text-muted-foreground">{selectedPlan.description}</p>

            <div className="text-3xl font-bold">
              KES {selectedPlan.price.toLocaleString()} / {selectedPlan.period}
            </div>

            <ul className="space-y-2 text-sm">
              {selectedPlan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  {f}
                </li>
              ))}
              {selectedPlan.notIncluded.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground line-through">
                  <div className="w-4 h-4 rounded-full border" />
                  {f}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full" onClick={() => setLocation("/landlord")}>
              Change Plan
            </Button>
          </CardContent>
        </Card>

        {/* ================= SUMMARY ================= */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Plan</span>
              <span>{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold">KES {selectedPlan.price.toLocaleString()}</span>
            </div>
            {/* <p className="text-sm text-muted-foreground">
              This is a mock checkout. Real payment integration will be added later.
            </p> */}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
