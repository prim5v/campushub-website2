import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LocationGate({ children }) {
  const [status, setStatus] = useState("loading"); 
  // loading | granted | denied

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("granted");
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // 🚫 BLOCK UI if not granted
  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking location...</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <h2 className="text-2xl font-bold">Location Required</h2>
        <p className="text-muted-foreground max-w-md">
          This app needs your location to show nearby rooms. 
          Turn on location and allow access.
        </p>

        <Button onClick={requestLocation}>
          Enable Location
        </Button>

        <p className="text-xs text-muted-foreground">
          If you blocked it, go to browser settings and allow location.
        </p>
      </div>
    );
  }

  return children;
}