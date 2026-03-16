import { useState } from "react";
import DashboardLayout from "@/components/landlord/DashboardLayout";
import DashboardHome from "@/components/landlord/DashboardHome";
import PropertiesPanel from "@/components/landlord/PropertiesPanel";
import ListingsPanel from "@/components/landlord/ListingsPanel";
import CommercialModal from "@/components/landlord/CommercialModal";
import PageTracker from "../components/PageTracker";

export default function LandlordDashboard() {
  const [active, setActive] = useState("dashboard");

  const [properties] = useState([
    // { id: 1, property_id: "prop001", property_name: "Sunrise Apartments", location: "Near Campus A", verified: 0 },
  ]);

  const [listings] = useState([{ id: 1, name: "Room 101", price: 8000, property_id: "prop001" }]);

  const userPlan = "Free"; // Fetch from backend for actual user

  return (
    <>
    <PageTracker page="Landlord Dashboard" />
      <DashboardLayout active={active} setActive={setActive}>
        {active === "dashboard" && <DashboardHome properties={properties} listings={listings} />}
        {active === "properties" && <PropertiesPanel properties={properties} />}
        {active === "listings" && <ListingsPanel listings={listings} />}
      </DashboardLayout>

      {/* Modals */}
      <CommercialModal type="upgrade" userPlan={userPlan} onClose={() => {}} />
      {properties.map((p) => (
        <CommercialModal key={p.id} type="verify" property={p} userPlan={userPlan} onClose={() => {}} />
      ))}
      <CommercialModal type="analytics" userPlan={userPlan} />
      <CommercialModal type="promo" userPlan={userPlan} />
      {properties.length === 0 && <CommercialModal type="empty" userPlan={userPlan} />}
    </>
  );
}
