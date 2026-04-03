import { createContext, useContext, useState, useEffect } from "react";
import ApiSocket from "@/utils/ApiSocket";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export function DashboardProvider({ children }) {
  const [data, setData] = useState({
    total_properties: 0,
    total_listings: 0,
  });
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [applied, setApplied] = useState(() => {
    const stored = localStorage.getItem("applied");
    return stored ? JSON.parse(stored) : false;
  });

  // persist applied state
  useEffect(() => {
    localStorage.setItem("applied", JSON.stringify(applied));
  }, [applied]);

  useEffect(() => {
    const getOverview = async () => {
      try {
        const res = await ApiSocket.get("/landlord/get_overview");

        setData({
          total_properties: res.total_properties || 0,
          total_listings: res.total_listings || 0,
        });

        setLatestAnnouncement(
          res.latest_announcement || {
            title: "Welcome back!",
            message: "You have no recent announcements.",
          }
        );
      } catch (err) {
        console.error("Failed to fetch overview data", err);
      }
    };

    getOverview();
  }, []);

  return (
    <DashboardContext.Provider
      value={{ data, applied, setApplied, latestAnnouncement, setLatestAnnouncement }}
    >
      {children}
    </DashboardContext.Provider>
  );
}