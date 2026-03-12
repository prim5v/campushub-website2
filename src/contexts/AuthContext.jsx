import { createContext, useContext, useState, useEffect } from "react";
import ApiSocket from "@/utils/ApiSocket";
import * as Sentry from "@sentry/react";



const AuthContext = createContext(null);

export const AUTH = {
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  OTP_REQUIRED: "otp_required",
  MPESA: "mpesa",
  CONSENT_REQUIRED: "consent_required",
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("auth_user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    // console.log("[Auth][Init] Loaded user from localStorage:", parsedUser);
    return parsedUser;
  });

  const [authStatus, setAuthStatus] = useState(() => {
    const status = localStorage.getItem("auth_status") || AUTH.IDLE;
    // console.log("[Auth][Init] Loaded authStatus from localStorage:", status);
    return status;
  });

  const [pendingEmail, setPendingEmail] = useState(() => {
    const email = localStorage.getItem("pending_email") || null;
    // console.log("[Auth][Init] Loaded pendingEmail from localStorage:", email);
    return email;
  });

  const [checkoutId, setCheckoutId] = useState(() =>{
    const checkoutId = localStorage.getItem("checkoutId") || null;
    return checkoutId;
  })

  // const [ checkoutId, setCheckoutId ] = useState(null)

  const [ mpesaStatus, setMpesaStatus ] = useState(null)

  const [ mpesaMessage, setMpesaMessage ] = useState(null)


  const [error, setError] = useState(null);
  const [signupPayload, setSignupPayload] = useState(null);


  /* =========================
     LOCAL STORAGE SYNC
  ========================= */
  useEffect(() => {
    // console.log("[Auth][useEffect] Updating localStorage for user:", user);
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  // useEffect(() => {
  //   console.log("[Auth][useEffect] Updating localStorage for authStatus:", authStatus);
  //   if (authStatus) localStorage.setItem("auth_status", authStatus);
  //   else localStorage.removeItem("auth_status");
  // }, [authStatus]);

  
  useEffect(() => {
  // console.log("[Auth][useEffect] Updating localStorage for authStatus:", authStatus);

  if (authStatus && authStatus !== AUTH.LOADING) {
    localStorage.setItem("auth_status", authStatus);
  } else {
    localStorage.removeItem("auth_status");
  }
}, [authStatus]);


  useEffect(() => {
    // console.log("[Auth][useEffect] Updating localStorage for pendingEmail:", pendingEmail);
    if (pendingEmail) localStorage.setItem("pending_email", pendingEmail);
    else localStorage.removeItem("pending_email");
  }, [pendingEmail]);

    useEffect(() => {
    // console.log("[Auth][useEffect] Updating localStorage for checkoutId:", checkoutId);
    if (checkoutId) localStorage.setItem("checkoutId", checkoutId);
    else localStorage.removeItem("checkoutId");
  }, [checkoutId]);

  /* =========================
     HELPERS
  ========================= */
  const resetError = () => {
    // console.log("[Auth] Resetting error");
    setError(null);
  };

  /* =========================
     SIGNUP
  ========================= */
  const signup = async ({ email, password, username, role, institution, acceptedTerms }) => {
    // console.log("[Auth][Signup] Called with:", { email, username, role, password: "***hidden***" });

    // setAuthStatus(AUTH.LOADING);
    resetError();

    try {
      // console.log("[Auth][Signup] Sending request to /auth/signup");
      const res = await ApiSocket.post("/auth/signup", { email, password, username, role, institution, acceptedTerms });
      // console.log("[Auth][Signup] Raw response:", res);

      if (res?.status === "verify_otp") {
        // console.log("[Auth][Signup] OTP required for:", res.email);
        setPendingEmail(res.email);
        setSignupPayload({ email, password, username, role, institution, acceptedTerms });
        setAuthStatus(AUTH.OTP_REQUIRED);

        return { otpRequired: true, email: res.email };
      }

      // Detect email send failure
      if (res?.status === 500 || res?.error === "failed to send email") {
        // Call API to notify the user via email
        // await ApiSocket.post("/auth/signup-failure-notify", { email, username });

        // Show consent UI
        setAuthStatus(AUTH.CONSENT_REQUIRED);
        setSignupPayload({ email, password, username, role, institution, acceptedTerms });
        setPendingEmail(res.email);
        return { consentRequired: true };
      }

      // Fallback for unexpected responses
      Sentry.captureException(res);
      throw new Error("Unexpected signup response");

      // console.error("[Auth][Signup] Unexpected response shape:", res);
      // Sentry.captureException(res) // messenger block
      // throw new Error("Unexpected signup response");
    } catch (err) {
      // console.error("[Auth][Signup] ERROR:", err);
      Sentry.captureException("[Auth][Signup] ERROR:", err)
      setAuthStatus(AUTH.UNAUTHENTICATED);
      setError(err?.error || err?.message || "Signup failed");
      return null;
    }
  };

  


  
  // landlord signup mpesa
const mpesaSignup = async (payload) => {
  const { user, plan, payment } = payload;
  setAuthStatus(AUTH.LOADING);

  try {
    const res = await ApiSocket.post(
      "/mpesaPaymentGetways/landlord_mpesa_signup",
      { user, plan, payment }
    );

    if (res?.status === "mpesa") {
      setAuthStatus(AUTH.MPESA);
      setCheckoutId(res.checkout_request_id)
      return true;
    }
    else if (res?.status === "paid") {
        setAuthStatus(AUTH.OTP_REQUIRED);
        setPendingEmail(res.email);
        return true;
      }
  } catch (err) {
    // console.error("[Auth][Mpesa] ERROR:", err);
    Sentry.captureException("[Auth][Mpesa] ERROR:", err)
    setAuthStatus(AUTH.UNAUTHENTICATED);
    setError(err?.error || err?.message || "Invalid Mpesa push");
    return false;
  }
};

// 5 second pull to check mpesa payment

const paymentstatusCheck = async (checkoutId) =>{
  try {
    const res = await ApiSocket.get(`/mpesaPaymentGetways/landlord_payment_status_check/${checkoutId}`);

    if (res?.status === "paid") {
        setAuthStatus(AUTH.OTP_REQUIRED);
        setMpesaStatus(res.status)
        setMpesaMessage(res.message)
        setPendingEmail(res.email);
        setCheckoutId(null)
        localStorage.removeItem("checkoutId");
        return true;
      }
    else if (res?.status === "failed") {
    setMpesaStatus("failed");
    setMpesaMessage(res.message || "Payment failed");
    setCheckoutId(null)
    localStorage.removeItem("checkoutId");
    return false;
}
    
  }catch (err) {
  // console.error("[Auth][Mpesa] ERROR:", err);
  Sentry.captureException("[Auth][Mpesa] ERROR:", err);

  // session expired → hard stop
  if (err?.status === 401) {
    setCheckoutId(null);
    localStorage.removeItem("checkoutId");
    return false;
  }

  // transient error → KEEP checkoutId
  setMpesaStatus("pending");
  setMpesaMessage("Checking payment status… please wait");
  return false;
}

}



  /* =========================
     VERIFY OTP
  ========================= */
  const verifyOtp = async ({ otp }) => {
    // console.log("[Auth][VerifyOtp] Called with:", { otp });
    // setAuthStatus(AUTH.LOADING);
    resetError();

    try {
      // console.log("[Auth][VerifyOtp] Sending request to /auth/verify-otp");
      const res = await ApiSocket.post("/auth/verify-otp", { email: pendingEmail, otp });
      // console.log("[Auth][VerifyOtp] Raw response:", res);

      if (res?.status === "success") {
        // console.log("[Auth][VerifyOtp] OTP verified. User:", res.user);
        setUser(res.user);
        setPendingEmail(null);
        setAuthStatus(AUTH.AUTHENTICATED);
        return true;
      }

      // console.error("[Auth][VerifyOtp] Verification failed:", res);
      Sentry.captureException("[Auth][VerifyOtp] Verification failed:", res)
      throw new Error("OTP verification failed");
    } catch (err) {
      // console.error("[Auth][VerifyOtp] ERROR:", err);
      Sentry.captureException("[Auth][VerifyOtp] ERROR:", err)
      setAuthStatus(AUTH.OTP_REQUIRED);
      setError(err?.error || err?.message || "Invalid or expired OTP");
      return false;
    }
  };

  /* =========================
     LOGIN
  ========================= */
  const login = async ({ email, password }) => {
    // console.log("[Auth][Login] Called with:", { email, password: "***hidden***" });
    // setAuthStatus(AUTH.LOADING);
    resetError();

    try {
      // console.log("[Auth][Login] Sending request to /auth/login");
      const res = await ApiSocket.post("/auth/login", { email, password });
      // console.log("[Auth][Login] Raw response:", res);

      if (res?.status === "success") {
        // console.log("[Auth][Login] Authenticated user:", res.user);
        setUser(res.user);
        setAuthStatus(AUTH.AUTHENTICATED);
        return true;
      }

      // console.error("[Auth][Login] Invalid response:", res);
      Sentry.captureException("[Auth][Login] Invalid response:", res)
      throw new Error("Invalid login response");
    } catch (err) {
      // console.error("[Auth][Login] ERROR:", err);
      Sentry.captureException("[Auth][Login] ERROR:", err)
      setAuthStatus(AUTH.UNAUTHENTICATED);
      setError(err?.error || err?.message || "Login failed");
      return false;
    }
  };



  /* =========================
     PROFIlE
  ========================= */

  // get profile on initial load

  
  
  useEffect(() => {
  const bootstrapAuth = async () => {
    // console.log("[Auth][Bootstrap] Checking session…");

    try {
      const res = await ApiSocket.get("/auth/profile"); // protected route

      if (res?.user) {
        // console.log("[Auth][Bootstrap] Session valid:", res.user);
        setUser(res.user);
        setAuthStatus(AUTH.AUTHENTICATED);
      } else {
        throw new Error("No user");
      }
    } catch (err) {
      // console.warn("[Auth][Bootstrap] No valid session");
      setUser(null);
      setAuthStatus(AUTH.UNAUTHENTICATED);
    }
  };

  // Only bootstrap if we are stuck in loading
  if (authStatus === AUTH.LOADING) {
    bootstrapAuth();
  }
}, []);


  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {

  if (!user || authStatus !== AUTH.AUTHENTICATED) {
    return;
  }

  setUser(null);
  setAuthStatus(AUTH.UNAUTHENTICATED);
  setPendingEmail(null);

  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_status");
  localStorage.removeItem("pending_email");

  setCheckoutId(null);
  setMpesaStatus(null);
  setMpesaMessage(null);

  localStorage.removeItem("checkoutId");
};

const remove =()=>{
  setUser(null);
  setAuthStatus(AUTH.IDLE);
  setPendingEmail(null);

  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_status");
  localStorage.removeItem("pending_email");

  setCheckoutId(null);
  setMpesaStatus(null);
  setMpesaMessage(null);

  localStorage.removeItem("checkoutId");
}


  // logout on token expiration 
  useEffect(() => {
  const handleLogout = () => {
    // console.warn("[Auth] Session expired — logging out");
    logout();
  };

  window.addEventListener("auth:logout", handleLogout);
  return () => window.removeEventListener("auth:logout", handleLogout);
}, []);



  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = { user, authStatus, pendingEmail, signupPayload, error, mpesaMessage, mpesaStatus, checkoutId, signup, verifyOtp, login, logout, remove, mpesaSignup, paymentstatusCheck};

  // console.log("[Auth] Current state:", { user, authStatus, pendingEmail,signupPayload, error });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* =========================
   HOOK
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
