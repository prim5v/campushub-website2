import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, Building2, Briefcase, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter"
import { X } from "lucide-react";
import * as Sentry from "@sentry/react";
import PageTracker from "../../components/PageTracker";



const roles = [
  { key: "comrade", label: "Comrade account", icon: Users },
  { key: "landlord", label: "Landlord account", icon: Building2 },
  // { key: "eservice", label: "E-Service account", icon: Briefcase },
];

export default function SignUp() {
  const [, setLocation] = useLocation();

  const [role, setRole] = useState("comrade");
  const [showLandlordPopup, setShowLandlordPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({
  role: "comrade",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  institution: "",
  acceptedTerms: false,
});
  const [otp, setOtp] = useState("");
  const { signup, error } = useAuth();
const institutions = [
  { name: "University of Nairobi", type: "University" },
  { name: "Kenyatta University", type: "University" },
  { name: "Moi University", type: "University" },
  { name: "Egerton University", type: "University" },
  { name: "Jomo Kenyatta University of Agriculture and Technology", type: "University" },
  { name: "Maseno University", type: "University" },
  { name: "Masinde Muliro University of Science and Technology", type: "University" },
  { name: "Dedan Kimathi University of Technology", type: "University" },
  { name: "Technical University of Kenya", type: "University" },
  { name: "Technical University of Mombasa", type: "University" },
  { name: "Pwani University", type: "University" },
  { name: "Kisii University", type: "University" },
  { name: "Laikipia University", type: "University" },
  { name: "South Eastern Kenya University", type: "University" },
  { name: "Multimedia University of Kenya", type: "University" },
  { name: "Murang'a University of Technology", type: "University" },
  { name: "Chuka University", type: "University" },
  { name: "Karatina University", type: "University" },
  { name: "Meru University of Science and Technology", type: "University" },
  { name: "Machakos University", type: "University" },
  { name: "Kaimosi Friends University", type: "University" },
  { name: "Taita Taveta University", type: "University" },
  { name: "Tharaka University", type: "University" },

  { name: "Strathmore University", type: "Private University" },
  { name: "United States International University Africa", type: "Private University" },
  { name: "Daystar University", type: "Private University" },
  { name: "Mount Kenya University", type: "Private University" },
  { name: "Zetech University", type: "Private University" },
  { name: "KCA University", type: "Private University" },
  { name: "Africa Nazarene University", type: "Private University" },
  { name: "Catholic University of Eastern Africa", type: "Private University" },
  { name: "Pan Africa Christian University", type: "Private University" },
  { name: "Scott Christian University", type: "Private University" },
  { name: "Adventist University of Africa", type: "Private University" },
  { name: "Great Lakes University of Kisumu", type: "Private University" },
  { name: "International Leadership University", type: "Private University" },
  { name: "Kabarak University", type: "Private University" },
  { name: "Kiriri Women's University of Science and Technology", type: "Private University" },
  { name: "St. Paul's University", type: "Private University" },
  { name: "Riara University", type: "Private University" },

  { name: "Kabete National Polytechnic", type: "TVET" },
  { name: "Kenya Technical Trainers College", type: "TVET" },
  { name: "Nyeri National Polytechnic", type: "TVET" },
  { name: "Eldoret National Polytechnic", type: "TVET" },
  { name: "Meru National Polytechnic", type: "TVET" },
  { name: "Kisumu National Polytechnic", type: "TVET" },
  { name: "Thika Technical Training Institute", type: "TVET" },
  { name: "Kiambu Institute of Science and Technology", type: "TVET" },
  { name: "Kabete Technical Training Institute", type: "TVET" },
  { name: "Rift Valley Technical Training Institute", type: "TVET" },
  { name: "Sigalagala National Polytechnic", type: "TVET" },
  { name: "Coast Institute of Technology", type: "TVET" },
  { name: "Mombasa Technical Training Institute", type: "TVET" },
  { name: "Railway Training Institute", type: "TVET" },
  { name: "Kenya Water Institute", type: "TVET" },
  { name: "Kenya Institute of Highways and Building Technology", type: "TVET" },
  { name: "Kenya Medical Training College", type: "TVET" },
  { name: "Nairobi Technical Training Institute", type: "TVET" },
  { name: "Machakos Technical Institute for the Blind", type: "TVET" },
  { name: "Karen Technical Training Institute for the Deaf", type: "TVET" },
  { name: "Michuki Technical Training Institute", type: "TVET" },
  { name: "Kaiboi Technical Training Institute", type: "TVET" },
  { name: "Ol'lessos Technical Training Institute", type: "TVET" },
  { name: "Aldai Technical Training Institute", type: "TVET" },
  { name: "Kitale National Polytechnic", type: "TVET" },
  { name: "Bungoma National Polytechnic", type: "TVET" },
  { name: "Friends College Kaimosi", type: "TVET" },
  { name: "North Eastern National Polytechnic", type: "TVET" },
  { name: "Wote Technical Training Institute", type: "TVET" },
  { name: "Mawego Technical Training Institute", type: "TVET" },
  { name: "Nyandarua Institute of Science and Technology", type: "TVET" },
  { name: "Murang'a Technical Training Institute", type: "TVET" },
  { name: "Taita Taveta Technical Training Institute", type: "TVET" },
  { name: "Kajiado West Technical and Vocational College", type: "TVET" },
  { name: "Kibabii Technical Training Institute", type: "TVET" },
  { name: "Keroka Technical Training Institute", type: "TVET" },
  { name: "Baringo Technical College", type: "TVET" },
  { name: "Siaya Institute of Technology", type: "TVET" },
  { name: "Nyakach Technical Training Institute", type: "TVET" },
  { name: "Garissa Technical Training Institute", type: "TVET" },
  { name: "Isiolo Technical Training Institute", type: "TVET" }
];
const [suggestions, setSuggestions] = useState([]);

  // function handleRoleSelect(r) {
  //   if (r !== "comrade") {
  //     setLocation(`/${r}`); // redirect immediately
  //     return;
  //   }
  //   setRole(r);
  // }

  function handleRoleSelect(r) {
  if (r === "landlord") {
    setShowLandlordPopup(true);
    return;
  }

  setRole(r);
}


async function handleSubmit(e) {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    // console.log("SUBMITTING SIGNUP FORM", form);

    await signup(form);

  } catch (error) {
    // console.error(error);
    Sentry.captureException(error)
  } finally {
    setLoading(false);
  }
}

function handleUniversityChange(e) {
  const value = e.target.value;
  setForm({ ...form, institution: value });

  if (!value) {
    setSuggestions([]);
    return;
  }

  const filtered = institutions
    .filter((inst) => inst.name.toLowerCase().includes(value.toLowerCase()))
    .map((inst) => inst.name); // just use the name for suggestions

  setSuggestions(filtered.slice(0, 5)); // limit to top 5
}

  // function handleVerifyOtp(e) {
  //   e.preventDefault();

  //   console.log("VERIFY OTP:", otp);

  //   alert("Account created successfully!");
  //   setLocation("/dashboard");
  // }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTracker page="Sign up"/>

      <div className="pt-32 pb-20 flex justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            {/* <Badge variant="secondary">
              {step === "form" ? "Sign Up" : "Verify OTP"}
            </Badge> */}

            <CardTitle className="text-2xl">
              {step === "form" ? "Create CampusHub Account " : "Verify Your Email"}
            </CardTitle>

            <h2 className="text-sm text-muted-foreground">select your account's purpose</h2>

            {/* ROLE SELECTOR */}
            <div className="flex gap-2 justify-center">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <Button
                    key={r.key}
                    variant={role === r.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleSelect(r.key)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </Button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent>

                          {error && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    placeholder="john_doe"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                  />
                </div>

              <div className="relative">
                <Label>Campus / Institution</Label>
                <Input
                  placeholder="Search your campus"
                  value={form.institution}
                  onChange={handleUniversityChange}
                  required
                />

                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-white border rounded-md mt-1 shadow z-10">
                    {suggestions.map((name) => (
                      <div
                        key={name}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setForm({ ...form, institution: name });
                          setSuggestions([]);
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  
                  <Label>Password</Label>
                  <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                  type="button"
                  onClick={()=> setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4"/>

                    ) : (
                      <Eye className="h-4 w-4"/>
                    )
                  }
                  </button>
                  </div>
                </div>

                <div>
                  <Label>Confirm Password</Label>
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

                {/* <Button className="w-full h-12">Create Account</Button> */}
                              <Button className="w-full h-12" disabled={loading}>
  {loading ? "Creating account..." : "Create Account"}
</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your email
                </p>

                <Input
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />

                <Button className="w-full h-12">Verify & Continue</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />

{showLandlordPopup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <Card className="max-w-md w-full relative">
      
      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowLandlordPopup(false)}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
      >
        <X className="w-5 h-5" />
      </button>

      <CardHeader>
        <CardTitle>Grow Faster With CampusHub Landlord Tools</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Before creating a landlord account, explore our listing plans,
          tenant verification tools, and promotion features designed to
          help you fill rooms faster and reach verified student tenants.
        </p>

        <div className="flex gap-2">
          <Button
            className="w-full"
            onClick={() => {
              setShowLandlordPopup(false);
              setLocation("/plans");
            }}
          >
            View Landlord Offers
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowLandlordPopup(false);
              setLocation("/landlord-signup");
            }}
          >
            Continue Signup
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}


    </div>
  );
}
