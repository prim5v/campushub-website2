import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import locationIllustration from "@assets/location_illustration.png"; // optional image

const LocationContext = createContext(null);
export const useLocation = () => useContext(LocationContext);

export default function LocationProvider({ children }) {
  const [coordinates, setCoordinates] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | granted | denied

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("granted");
      },
      (error) => {
        setStatus("denied");
        console.error("Location error:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking your location…</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        {/* {locationIllustration && (
          <img
            src={locationIllustration}
            alt="Enable location"
            className="w-48 h-48 object-contain"
          />
        )} */}
        <h2 className="text-2xl font-bold">Enable Your Location</h2>
        <p className="text-muted-foreground max-w-md">
          CampusHub uses your location to show you <strong>nearby verified student rooms</strong> 
          so you can find your next home faster and avoid long commutes.
        </p>
        <Button size="lg" onClick={requestLocation}>
          Enable Location
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          If you previously blocked location, click the 🔒 icon in your browser's address bar and allow location access, then click "Enable Location" again.
        </p>
      </div>
    );
  }

  return (
    <LocationContext.Provider value={{ coordinates, status, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}