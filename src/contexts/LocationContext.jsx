import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";

// import your animations
import introAnim from "../../assets/lottie/location-intro.json";
import loadingAnim from "../../assets/lottie/location-loading.json";
import deniedAnim from "../../assets/lottie/location-denied.json";
import successAnim from "../../assets/lottie/location-intro.json";


const LocationContext = createContext(null);
export const useLocation = () => useContext(LocationContext);

export default function LocationProvider({ children }) {
  const [coordinates, setCoordinates] = useState(null);
  const [status, setStatus] = useState("checking");
  // checking | intro | loading | granted | denied | done

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setStatus("granted");

        setTimeout(() => {
          setStatus("done");
        }, 1000);
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true }
    );
  };

  // 🔥 SMART PERMISSION CHECK
  useEffect(() => {
    if (!navigator.permissions) {
      // fallback (older browsers)
      setStatus("intro");
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          requestLocation(); // skip intro completely
        } else if (result.state === "prompt") {
          setStatus("intro");
        } else if (result.state === "denied") {
          setStatus("denied");
        }

        // listen for changes (advanced UX)
        result.onchange = () => {
          if (result.state === "granted") {
            requestLocation();
          }
        };
      })
      .catch(() => {
        setStatus("intro");
      });
  }, []);

  // ⏳ INITIAL CHECK
  if (status === "checking") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Preparing your experience…</p>
      </div>
    );
  }

  // 🎯 INTRO (ONLY when needed)
  if (status === "intro") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <Lottie animationData={introAnim} className="w-56 h-56" />

        <h1 className="text-3xl font-bold mt-4">
          Find rooms near your campus
        </h1>

        <p className="text-muted-foreground mt-3 max-w-md">
          We use your location to show nearby verified student housing.
        </p>

        <Button size="lg" className="mt-6" onClick={requestLocation}>
          Get Started
        </Button>
      </div>
    );
  }

  // 🔄 LOADING
  if (status === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Lottie animationData={loadingAnim} className="w-40 h-40" />
        <p className="text-muted-foreground mt-4">
          Finding your location…
        </p>
      </div>
    );
  }

  // ✅ SUCCESS
  if (status === "granted") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Lottie animationData={successAnim} className="w-40 h-40" />
        <p className="mt-3 font-medium">Location found</p>
      </div>
    );
  }

  // ❌ DENIED
  if (status === "denied") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <Lottie animationData={deniedAnim} className="w-52 h-52" />

        <h2 className="text-2xl font-bold mt-2">
          Enable Location Access
        </h2>

        <p className="text-muted-foreground max-w-md mt-2">
          Turn on location to see nearby listings.
        </p>

        <Button size="lg" className="mt-6" onClick={requestLocation}>
          Try Again
        </Button>
      </div>
    );
  }

  // 🚀 APP
  return (
    <LocationContext.Provider value={{ coordinates, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}