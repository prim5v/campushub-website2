import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, Building2, Briefcase, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorSocket } from "@/utils/ErrorSocket";
import { Link } from "wouter"
import PageTracker from "../../components/PageTracker";
const roles = [
  { key: "comrade", label: "Comrade", icon: Users },
  { key: "landlord", label: "Landlord", icon: Building2 },
  { key: "eservice", label: "E-Service", icon: Briefcase },
];

export default function SignIn() {
  const { login, error } = useAuth()
  const [, setLocation] = useLocation();
  const [role, setRole] = useState("comrade");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorSocket, setErrorSocket] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

    useEffect(() => {
    // const unsubscribe = ErrorSocket.on((err) => {
    //   console.log("Global error received:", err);
    //   setErrorSocket(err);
    // });
    const unsubscribe = ErrorSocket.on((err) => {
  if (err.status === 401) return; // ignore, handled globally
  setErrorSocket(err);
});


    return unsubscribe; // cleanup
  }, []);

  const displayError = errorSocket?.message || error;


  // function handleRoleSelect(r) {
  //   if (r !== "comrade") {
  //     setLocation(`/${r}`); // redirect to other flow
  //     return;
  //   }
  //   setRole(r);
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorSocket(null);
    setLoading(true)
    const ok = await login(form);
    if (ok) {
      setLocation("/auth-redirect");
    }

    

    // MOCK LOGIN
    // console.log("LOGIN DATA:", { role, ...form });
    

    // alert("login successful!");
    // setLocation("/dashboard");
    setLoading(false)
  }
  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTracker page="login"/>

      <div className="pt-32 pb-20 flex justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            {/* <Badge variant="secondary">Sign In</Badge> */}
            <CardTitle className="text-2xl">Welcome Back</CardTitle>

            {/* ROLE SELECTOR */}
            {/* <div className="flex gap-2 justify-center">
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
            </div> */}
          </CardHeader>

          <CardContent>
                          {/* {error && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {error}
              </div>
            )}

            {errorSocket && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {errorSocket.message}
              </div>
            )} */}

            {displayError && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-red-600">
                {displayError}
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* After the password input div */}
<div className="flex justify-end mb-4">
  <Link
    href="/forgot-password"
    className="text-sm text-primary hover:underline"
  >
    Forgot Password?
  </Link>
</div>

              <Button className="w-full h-12" disabled={loading}>
  {loading ? "Signing in..." : "Sign In"}
</Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
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
