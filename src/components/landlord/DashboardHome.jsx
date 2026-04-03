import { use, useEffect, useState } from "react";
import Joyride from "react-joyride";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLandlord } from "@/contexts/LandlordContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { useLocation } from "wouter";
import ApiSocket from "@/utils/ApiSocket";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import AuthPoller from "./AuthPoller";
import AddListingModal from "@/components/landlord/AddListingModal";
import AddPropertyModal from "@/components/landlord/AddPropertyModal";
// import { type } from "os";
// import { type } from "os";

export default function DashboardHome({ properties, listings }) {
  const [data, setData] = useState({
    total_properties: 0,
    total_listings: 0,
  });

  const { authStatus } = useAuth();
  const { lordstatus, badgeShown } = useLandlord();
  // console.log("DashboardHome render - lordstatus:", lordstatus, "badgeShown:", badgeShown);
  const [, setLocation] = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(null); // NEW
  const ourLink = badgeShown ? "/badge" : "/get-badge";
  

  const [message, setMessage] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const showBadgeCard = lordstatus === "verified"; // adjust later when you track badge status
  const { applied } = useDashboard();

  const actionCards = [
  {
    show: applied === false, // only show if not applied for badge yet
    title: "Get Verified Badge",
    text: "Boost trust and get more student bookings by getting your verified badge.",
    image: "/images/badge1.png",
    buttonText: badgeShown ? "Continue Claiming Badge" : "Get Badge",
    type: "badge",
    link: badgeShown ? "/badge" : "/get-badge",
  },
  {
    show: lordstatus === "verified" && data.total_properties === 0,
    title: "Add Your First Property",
    text: "Start by adding your first property so students can see what you offer.",
    image: "/images/image3.jfif",
    buttonText: "Add Property",
    type: "property",
    link: "/dashboard/properties",
  },
  {
    show: lordstatus === "verified" && data.total_listings === 0,
    title: "Create Your First Listing",
    text: "Create a listing so your property becomes visible to students.",
    image: "/images/image1.jfif",
    buttonText: "Create Listing",
    type: "listing",
    link: "/dashboard/listings",
  },
];

  // ================= Guided Tour Steps =================
  const landlordTourSteps = [
    {
      target: "body",
      content: "👋 Welcome to your Landlord Dashboard! Let’s take a quick tour.",
      placement: "center",
    },
    {
      target: "#overview-cards",
      content: "This section gives you a quick summary of your dashboard activity.",
    },
    {
      target: "#total-properties-card",
      content: "Here you can see how many properties you’ve added.",
    },
    {
      target: "#total-listings-card",
      content: "This shows how many listings are currently live for students.",
    },
    {
      target: "#account-status-card",
      content: "This is your verification status. Only verified accounts can post listings.",
    },
    {
      target: "#welcome-message",
      content: "Important messages and updates will appear here.",
    },
    {
      target: "#verify",
      content: "If your account is unverified, you’ll see this banner prompting you to verify.",
    },
    {
  target: "#right-sidebar",
  content: "This is your quick access sidebar for profile and account settings.",
},
{
  target: "#sidebar-profile",
  content: "View and manage your personal profile here.",
},
{
  target: "#sidebar-account",
  content: "Account settings, security, and preferences live here.",
},
{
  target: "#sidebar-logout",
  content: "Use this button to safely log out of your account.",
},
{
  target: "#dashboard-sidebar",
  content: "This is your main navigation panel.",
},
{
  target: "#sidebar-item-dashboard",
  content: "Your dashboard gives you a quick overview of activity.",
},
{
  target: "#sidebar-item-properties",
  content: "Manage and add your rental properties here.",
},
{
  target: "#sidebar-item-listings",
  content: "Control which properties are visible to students.",
},


  ];

  // ================= Fetch Dashboard Overview =================
useEffect(() => {
  const getOverview = async () => {
    try {
      const res = await ApiSocket.get("/landlord/get_overview");

      setData({
        total_properties: res.total_properties || 0,
        total_listings: res.total_listings || 0,
      });

      // Save latest announcement
      if (res.latest_announcement) {
        setLatestAnnouncement(res.latest_announcement);
      } else {
        setLatestAnnouncement({
          title: "Welcome back!",
          message: "You have no recent announcements."
        });
      }
    } catch (error) {
      console.error("Failed to fetch overview data", error);
    }
  };

  getOverview();
}, []);


  // ================= Run Tour Only on First Visit =================
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("landlord_dashboard_tour");
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  // ================= Auth Guard ================= should run a useEffect that checks authstatus and redirects if unauthenticated
// useEffect(() => {
//   if (authStatus === "unauthenticated") {
//     toast.error("Session timed out, please login again");
//     console.log("Auth status is unauthenticated, redirecting to login...");
//     setLocation("/signin");
//   }
// }, [authStatus, setLocation]);


  return (
    <>
     {/* Auth poller to check session every 10 seconds */}
      <AuthPoller />
      {/* ================= Guided Tour ================= */}
      <Joyride
        steps={landlordTourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        disableOverlayClose
        styles={{
          options: {
            primaryColor: "#2563eb",
            zIndex: 10000,
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped") {
            localStorage.setItem("landlord_dashboard_tour", "true");
            setRunTour(false);
          }
        }}
      />

      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* ================= Banner for unverified accounts ================= */}
      {lordstatus === "unverified" && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-3" id="verify">
          <span className="text-sm md:text-base font-medium">
            ⚠️ Your account is currently unverified. Verify it to be able to post properties and listings.
          </span>
          <Button
            size="sm"
            onClick={() => setLocation("/verify-account")}
            className="bg-yellow-400 hover:bg-yellow-500 text-white"
          >
            Start Verification
          </Button>
        </div>
      )}

      {lordstatus === "pending" && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span className="text-sm md:text-base font-medium">
            ⏳ Your account verification is pending. We are currently reviewing your documents.
            This may take up to 48 hours.
          </span>
        </div>
      )}

      {/* ================= Optional welcome/info message ================= */}
      {latestAnnouncement && (
  <div
    className="mb-4 p-4 bg-green-100 text-green-800 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2"
    id="welcome-message"
  >
    <div className="flex flex-col">
      <span className="font-semibold text-lg">{latestAnnouncement.title}</span>
      <span>{latestAnnouncement.message}</span>
    </div>
    <button
      onClick={() => setLatestAnnouncement(null)}
      className="ml-4 text-green-800 hover:text-green-900 font-bold text-lg leading-none"
      aria-label="Dismiss message"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
)}

      {/* ================= Overview Cards ================= */}
      <div
        id="overview-cards"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Card id="total-properties-card">
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.total_properties}
          </CardContent>
        </Card>

        <Card id="total-listings-card">
          <CardHeader>
            <CardTitle>Total Listings</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.total_listings}
          </CardContent>
        </Card>

        <Card id="account-status-card">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>
              {lordstatus === "verified" ? "Active" : "Pending Verification"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* ================= Render cards ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
  {actionCards
    .filter((card) => card.show)
    .map((card, index) => (
      <div
        key={index}
        className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer"
        // onClick={() => setLocation(card.link)}
      >
        {/* Background Image */}
        <img
          src={card.image}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-semibold">{card.title}</h3>

          <p className="text-sm text-white/80 mb-3">
            {card.text}
          </p>

          <Button
            size="sm"
            className="w-fit bg-white text-black hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation(); // prevents double trigger
              // setLocation(card.link);
              if(card.type === "badge") {
      setLocation(ourLink); // navigate immediately
    } else {
              setShowAddModal(true);
              setModalType(card.type); // NEW
    }
              
            }}
          >
            {card.buttonText}
          </Button>
        </div>
      </div>
    ))}
    
{modalType === "listing" && (
  <AddListingModal
    open={showAddModal}
    onClose={() => setShowAddModal(false)}
    onSuccess={() => fetchListings()}
  />
)}

{modalType === "property" && (
  <AddPropertyModal
    open={showAddModal}
    onClose={() => setShowAddModal(false)}
    onSuccess={() => {
      window.location.reload();
    }}
  />
)}

{/* {modalType === "badge" && (
  setLocation(ourLink)
)} */}

</div>




    </>
  );
}

