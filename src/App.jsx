// App.jsx
import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import * as Sentry from "@sentry/react";

import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import RoomDetail from "./pages/RoomDetail";
import Landlord from "./pages/Landlord";
import LandlordSignUp from "./pages/Auth/LandlordSignUp";
import OtpVerification from "./pages/Auth/OtpVerification";
import { useAuth } from "@/contexts/AuthContext"
import LoadingScreen from "./pages/Auth/LoadingScreen";
import RoleRouter from "./RoleRouter";
import MpesaScreen from "./pages/Auth/MpesaScreen";
import Profile from "./pages/comrade/Profile";
import LandlordDashboard from "./pages/LandlordDashboard"
import FullProfile from "./components/landlord/FullProfile";
import Plans from "./components/landlord/Plans";
import Verification from "./components/landlord/Verification";
import MarketPlaceLoad from "./pages/comrade/MarketPlaceLoad";
import Unauthorized from "./pages/unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import SafetyTips from "./pages/comrade/SafetyTips";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AppRedirector from "./AppRedirector";
import AuthNudgeController from "./components/AuthNudgeController";
import CookieConsentModal from "./components/CookieConsentModal";
import MarketplaceNudgeController from "./components/MarketplaceNudgeController";
import MaintenanceScreen from "./components/MaintenanceScreen";
import { useState, useEffect } from "react";
import ApiSocket from "@/utils/ApiSocket";
import ForgotPassword from "./pages/comrade/ForgotPassword";
import ResetPassword from "./pages/comrade/ResetPassword";
import SignupConsentPage from "./pages/Auth/SignupConsentScreen";
import RoomRequestController from "./components/RoomRequestController";
import RequestsPage from "./pages/Request";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import GetBadge from "./pages/GetBadge";
import Badge from "./pages/Badge";
import AddListingModal from "./components/landlord/AddListingModal";
import LandlordListings from "./components/landlord/ListingsPanel";
import Waitlist from "./pages/Waitlist";
import { StudentApp } from "./components/student/App";




function Router() {
  const { authStatus } = useAuth()



// if unauthenticated
if (authStatus === "unauthenticated") {
  return (
    <Switch>
       <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/room" component={RoomDetail} />
      <Route path="/landlord" component={Landlord} />
      <Route path="/profile" component={Profile} />
      {/* <Route path="/landlord-dashboard" component={LandlordDashboard} /> */}
      <Route path="/landlord-dashboard">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/marketplace" component={MarketPlaceLoad} />
      <Route path="/plans" component={Plans} />
      <Route path="/safety-tips" component={SafetyTips} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/room-request" component={RequestsPage} />
      <Route path="/get-badge" component={GetBadge} />
      <Route path="/badge" component={Badge} />

      {/* <Route component={Unauthorized}/> */}

      <Route path="/landlord-signup">
        <LandlordSignUp />

        {/* AUTH */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      </Route>


      {/* AUTH */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      {/* 404 fallback */}
      <Route component={NotFound} />

      {/* Force redirect for everything else */}
      <Redirect to="/" />
    </Switch>
  );
}

  
  //if authenticated

if (authStatus === "authenticated") {
  return (
    <Switch>
      {/* Entry redirect */}
      <Route path="/auth-redirect" component={RoleRouter} />

      {/* Normal app pages */}
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/room" component={RoomDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/landlord">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/landlord-dashboard">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/full-profile" component={FullProfile} />
      <Route path="/plans" component={Plans} />
      <Route path="/verify-account" component={Verification} />
      <Route path="/marketplace" component={MarketPlaceLoad} />
      <Route path="/safety-tips" component={SafetyTips} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/room-request" component={RequestsPage} />
      <Route path="/get-badge" component={GetBadge} />
        <Route path="/badge">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <Badge/>
        </ProtectedRoute>
      </Route>
       <Route path="/dashboard/properties">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <Badge/>
        </ProtectedRoute>
      </Route>
       <Route path="/dashboard/listings">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordListings/>
        </ProtectedRoute>
      </Route>
      <Route path="/landlord-signup">
        <LandlordSignUp />
      </Route>

       {/* AUTH */}
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route component={Unauthorized}/>

      {/* 404 fallback */}


      <Route component={NotFound} />
    </Switch>
  );
}


  // screen flow 
  if (authStatus === "otp_required") {
    return (
      <Switch>
        <Route>
          <OtpVerification />
        </Route>
      </Switch>
    );
  }

  if (authStatus === "consent_required"){
    return(
      <Switch>
        <Route>
          <SignupConsentPage/>
        </Route>
      </Switch>
    )
  }

  // when loading later can add loading from diff contexts

  if (authStatus === "loading") {
    return (
      <Switch>
        <Route>
          <LoadingScreen />
        </Route>
      </Switch>

    )
  }

    if (authStatus === "mpesa") {
    return (
      <Switch>
        <Route>
          <MpesaScreen />
        </Route>
      </Switch>

    )
  }
    

  // routes for authStatus idle
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/room" component={RoomDetail} />
      <Route path="/landlord" component={Landlord} />
      <Route path="/profile" component={Profile} />
      {/* <Route path="/landlord-dashboard" component={LandlordDashboard} />   */}
      <Route path="/landlord-dashboard">
        <ProtectedRoute allowedRoles={["landlord"]}>
          <LandlordDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/marketplace" component={MarketPlaceLoad} />
      <Route path="/plans" component={Plans} />
      <Route path="/safety-tips" component={SafetyTips} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/room-request" component={RequestsPage} />
      <Route path="/get-badge" component={GetBadge} />
      <Route path="/badge" component={Badge} />
      <Route path="/landlord-signup">
        <LandlordSignUp />
      </Route>


      {/* AUTH */}
      <Route path="/signin" component={SignIn} />
      
      <Route path="/signup" component={SignUp} />
      <Route component={Unauthorized}/>

      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {

    const [maintenance, setMaintenance] = useState(() => {
    const stored = localStorage.getItem("maintenance");
    if (stored) return JSON.parse(stored);

    return {
      loading: true,
      active: false,
      message: ""
    };
    });


useEffect(() => {
  let isMounted = true;

  const fetchMaintenance = async () => {
    try {
      const res = await ApiSocket.get("/comrade/system_maintenance");
      if (!isMounted) return;
      const newState = {
        loading: false,
        active: res.is_active,
        message: res.message
      };

      setMaintenance(newState);
      localStorage.setItem("maintenance", JSON.stringify(newState));
    } catch (err) {
  // console.error("Failed to fetch maintenance status:", err);
  Sentry.captureException(err); // replaces console.error
  if (!isMounted) return;

  const stored = localStorage.getItem("maintenance");
  if (stored) {
    setMaintenance(JSON.parse(stored));
  } else {
    setMaintenance({ loading: false, active: false, message: "" });
  }
}
  };

  fetchMaintenance(); // initial fetch

  const interval = setInterval(fetchMaintenance, 5000); // refresh every 5s

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

if (maintenance.loading) return <LoadingScreen />;
// if (maintenance.active ) return <MaintenanceScreen message={maintenance.message} />;
if (maintenance.active ) return <StudentApp/>;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRedirector/>
        <AuthNudgeController />
        <MarketplaceNudgeController />
        <Analytics/>
        <SpeedInsights/> 
        <RoomRequestController/>
        <CookieConsentModal />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
