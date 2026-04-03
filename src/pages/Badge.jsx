// src/pages/Badge.jsx
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TransparentLoadingSpinner from "@/components/TransparentLoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import ApiSocket from "@/utils/ApiSocket";
import { useDashboard } from "@/contexts/DashboardContext";

export default function Badge() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [user, setUser] = useState(null);
  const [, navigate] = useLocation();
  const { applied, setApplied } = useDashboard();
  

  const urlParams = new URLSearchParams(window.location.search);
  const badgeType =
    urlParams.get("type") || JSON.parse(localStorage.getItem("badge_type")) || "free";

  const { authStatus } = useAuth();

  // Auth check
  useEffect(() => {
    const authUser =
      authStatus === "authenticated"
        ? JSON.parse(localStorage.getItem("auth_user"))
        : null;
    if (!authUser) {
      alert("Please login first");
      navigate("/signin");
    } else {
      setUser(authUser);
    }
  }, []);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await ApiSocket.get("/landlord/get_properties");
        setProperties(res.properties || []);
        if (res.properties?.[0]) setSelectedPropertyId(res.properties[0].property_id);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Handle badge request
  const handleConfirm = async () => {
    if (!selectedPropertyId) {
      alert("Select a property first");
      return;
    }
    setLoading(true);
    try {
      const selectedProperty = properties.find(
        (p) => p.property_id === selectedPropertyId
      );
      await ApiSocket.post("/landlord/badge_request", {
        property_name: selectedProperty?.property_name,
        badge_type: badgeType,
      });
      alert("Congratulations! Badge request submitted successfully.");
      navigate("/landlord-dashboard");
      setApplied(true); // mark as applied to hide badge card
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.error || err?.message || "Failed to submit badge request"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/10 z-50">
        <TransparentLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center">

        {/* LEFT SIDE - Info */}
        <div className="flex-1 p-10 flex flex-col gap-6 z-10">
          <h1 className="text-4xl font-bold text-primary">
            {badgeType === "free"
              ? "Claim Your Free Verification Badge"
              : "Purchase Verification Badge"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Verified properties get more student trust and faster bookings. Select
            a property below to proceed.
          </p>

          {/* Property selection */}
          <div className="flex flex-col gap-2">
            {properties.map((prop) => (
              <label
                key={prop.property_id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={selectedPropertyId === prop.property_id}
                  onChange={() => setSelectedPropertyId(prop.property_id)}
                  className="accent-primary"
                />
                <span className="font-medium">{prop.property_name}</span>
              </label>
            ))}
          </div>

          {/* Confirm button */}
          <Button
            className="mt-4 bg-primary text-white hover:bg-primary/90"
            onClick={handleConfirm}
          >
            {badgeType === "free" ? "Claim Free Badge" : "Purchase Badge"}
          </Button>
        </div>

        {/* RIGHT SIDE - Hero-style image */}
        <div className="flex-1 w-full h-96 relative">
          <img
            src="/images/badge1.png"
            alt="Badge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-white"></div>
        </div>
      </div>
    </div>
  );
}