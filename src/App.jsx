// App.jsx
import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";

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
      {/* <Route path="/landlord" component={LandlordDashboard} /> */}

      {/* <Route path="/landlord-dashboard" component={LandlordDashboard} /> */}

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

  // if (authStatus === "authenticated") {
  //   return (
  //     <Switch>
  //       <Route>
  //         <RoleRouter />
  //       </Route>
  //     </Switch>
  //   );
  // }




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
      <Route path="/landlord-dashboard" component={LandlordDashboard} />
      <Route path="/marketplace" component={MarketPlaceLoad} />
      <Route path="/plans" component={Plans} />
      <Route path="/safety-tips" component={SafetyTips} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
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
  const [maintenance, setMaintenance] = useState({ loading: true, active: false, message: "" });

useEffect(() => {
  let isMounted = true;

  const fetchMaintenance = async () => {
    try {
      const res = await ApiSocket.get("/comrade/system_maintenance");
      if (!isMounted) return;
      setMaintenance({
        loading: false,
        active: res.is_active,
        message: res.message,
      });
    } catch (err) {
      console.error("Failed to fetch maintenance status:", err);
      if (!isMounted) return;
      setMaintenance({ loading: false, active: false, message: "" });
    }
  };

  fetchMaintenance(); // initial fetch

  const interval = setInterval(fetchMaintenance, 60000); // refresh every 60s

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

if (maintenance.loading) return <LoadingScreen />;
if (maintenance.active) return <MaintenanceScreen message={maintenance.message} />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRedirector/>
        <AuthNudgeController />
        <MarketplaceNudgeController />
        <CookieConsentModal />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
