import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ApiSocket from "@/utils/ApiSocket";
import * as Sentry from "@sentry/react";

const LandlordContext = createContext(null);

export const LORD = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  PENDING: "pending",
};

export const LandlordProvider = ({ children }) => {
  // get user object from auth
  const { user } = useAuth(); 

  // profile state
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  // landlord verification status
  const [lordstatus, setLordStatus] = useState(() => {
    return localStorage.getItem("lordstatus") || LORD.PENDING;
  });

  const [badgeShown, setBadgeShown] = useState(() => {
    const shown = localStorage.getItem("badgeShown");
    return shown === "true"; // convert string to boolean
  });

  // fetch profile when user is available
  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  // persist lordstatus
  useEffect(() => {
    localStorage.setItem("lordstatus", lordstatus);
  }, [lordstatus]);

  // persist badgeShown
  useEffect(() => {
    localStorage.setItem("badgeShown", badgeShown.toString());
  }, [badgeShown]);


  /* =========================
      GET FULL PROFILE
  ========================= */
  const getProfile = async () => {
    try {
      const res = await ApiSocket.get("/auth/profile");

      const profileData = res?.user;

      if (profileData) {
        setProfile(profileData);
        // console.log("Fetched landlord profile:", profileData);

        const status =
          profileData?.verification?.status || LORD.PENDING;

        setLordStatus(status);
      }
    } catch (error) {
      // console.error("Error fetching profile:", error);
      Sentry.captureException("Error fetching profile:", error)
      setError(error);
      setProfile(null);
      setLordStatus(LORD.PENDING);
    }
  };

 const getPlans = async () => {
  try {
    const res = await ApiSocket.get("/landlord/get_plans");
    const plansdata = res?.data?.plans || res?.plans || [];

    if (plansdata.length > 0) {
      return plansdata;
    }
  } catch (error) {
    // console.error("Error fetching plans:", error);
    Sentry.captureException("Error fetching plans:", error)
    setError(error);
  }
 }

  /* =========================
      CONTEXT VALUE
  ========================= */
  const value = {
    profile,
    plans,
    setProfile,
    lordstatus,
    badgeShown,
    setLordStatus,
    setBadgeShown,
    refreshProfile: getProfile, // 👈 useful later
    getPlans,
  };

  // console.log("LandlordContext profile:", profile);

  return (
    <LandlordContext.Provider value={value}>
      {children}
    </LandlordContext.Provider>
  );
};

export const useLandlord = () => {
  const context = useContext(LandlordContext);
  if (!context) {
    throw new Error("useLandlord must be used within a LandlordProvider");
  }
  return context;
};
