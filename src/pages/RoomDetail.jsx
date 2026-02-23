import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import SkeletonLoading from "@/components/SkeletonLoading";
import { Helmet } from "react-helmet";
import {
  MapPin, Shield, Star, Heart, Share2, Wifi, Droplets, Zap, Car, Users,
  Ruler, Calendar, MessageCircle, Phone, ChevronLeft, ChevronRight,
  CheckCircle2, Clock,

  BatteryCharging,
  Sun,
  Camera,
  Fence,
  Lock,
  ParkingCircle,
  Bike,
  Sofa,
  Boxes,
  Home,
  Grid,
  Layout,
  Warehouse,
  ShowerHead,
  Bath,
  DoorClosed,
  WashingMachine,
  Trash2,
  Leaf,
  Building2,
  BookOpen,
  Dog,
  CigaretteOff,
  GlassWater
} from "lucide-react";

import { useState, useEffect } from "react";
import { Link } from "wouter";
import ApiSocket from "@/utils/ApiSocket";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function RoomDetail() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("room");
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const { authStatus } = useAuth();
  const [showPhone, setShowPhone] = useState(false);
  const [, setLocation] = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  const FAVORITES_KEY = "campushub_favorites";

const getLocalFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
};

const setLocalFavorites = (list) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
};

const isFavoritedLocal = (roomId) => {
  return getLocalFavorites().includes(roomId);
};


useEffect(() => {
  if (roomId) {
    setIsFavorited(isFavoritedLocal(roomId));
  }
}, [roomId]);

const toggleFavorite = async () => {
  const newState = !isFavorited;
  setIsFavorited(newState); // optimistic UI

  // Always update localStorage
  let favorites = getLocalFavorites();

  if (newState) {
    if (!favorites.includes(roomId)) favorites.push(roomId);
  } else {
    favorites = favorites.filter(id => id !== roomId);
  }

  setLocalFavorites(favorites);

  // 🔥 Try backend sync (if logged in)
  try {
    await ApiSocket.post("/user/toggle_favorite", {
      listing_id: roomId,
      favorited: newState
    });
  } catch (err) {
    console.warn("Backend favorite sync failed, using local only.");
    // Do NOT rollback UI — keep smooth UX
  }
};



  // Map backend amenity keys to icons
const iconMap = {
  // Utilities
  wifi: Wifi,
  fibre: Wifi,
  borehole: Droplets,
  city_water: Droplets,
  water_tank: GlassWater,
  prepaid_power: Zap,
  backup_power: BatteryCharging,
  solar_hot_water: Sun,

  // Security & Access
  security: Shield,
  cctv: Camera,
  gated: Fence,
  electric_fence: Fence,
  controlled_access: Lock,

  // Parking
  parking: Car,
  private_parking: ParkingCircle,
  motorbike_parking: Bike,

  // Furniture & Interior
  furnished: Sofa,
  semi_furnished: Sofa,
  wardrobe: Boxes,
  balcony: Home,
  tiled_floor: Grid,
  wood_floor: Layout,

  // Kitchen
  open_kitchen: Layout,
  kitchen_cabinets: Warehouse,
  pantry: Boxes,

  // Bathroom
  hot_shower: ShowerHead,
  instant_shower: ShowerHead,
  bathtub: Bath,
  separate_toilet: DoorClosed,

  // Outdoor & Utility
  laundry_area: WashingMachine,
  drying_area: Sun,
  garbage: Trash2,
  garden: Leaf,
  rooftop: Building2,

  // Building & Shared
  elevator: Building2,
  caretaker: Users,
  shared_kitchen: Users,
  shared_bathroom: Users,
  common_room: Users,
  study_area: BookOpen,

  // Rules
  pets_allowed: Dog,
  no_smoking: CigaretteOff,

  // Staff
  warden: Shield
};

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if(coordinates.latitude && coordinates.longitude){
      const fetchRoomData = async () => {
        try {
          setLoading(true);
          const data = await ApiSocket.post(`/comrade/get_listing_details/${roomId}`, { coordinates });
          const room = data.listing;

          // Map amenities to include icons
          const formattedAmenities = room.amenities.map(a => ({
            name: a.name,
            available: a.available,
            icon: iconMap[a.key] || Wifi,
          }));

          // Calculate total deposit
          const depositTotal = Object.values(room.deposit).reduce((sum, val) => sum + Number(val), 0);

          // Format landlord memberSince
          const landlord = {
            ...room.landlord,
            memberSince: new Date(room.landlord.memberSince).getFullYear()
          };

          setRoomData({
            ...room,
            amenities: formattedAmenities,
            depositTotal,
            landlord
          });

          setError(null);
        } catch (error) {
          console.error("Failed to fetch room data:", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchRoomData();
    }
  }, [coordinates, roomId]);


  // const handleShowPhone = () => {
  //   if (authStatus !== "authenticated") {
  //     alert("Please login to view phone number");
  //     setLocation("/signin");
  //     return;
  //   }

  //   setShowPhone(true);
  // };

  const handleShowPhone = () => {
  if (authStatus !== "authenticated") {
    alert("Please login to view phone number");
    setLocation("/signin");
    return;
  }

  const phone = roomData?.landlord?.phoneNumber || "0113899517";

  if (!showPhone) {
    setShowPhone(true);
  } else {
    // OPEN WHATSAPP
    window.open(`https://wa.me/${phone.replace(/^0/, "254")}`, "_blank");

    // OR OPEN CALL DIALER (choose one)
    window.location.href = `tel:${phone}`;
  }
};
  
const handleContactRequest = () => {
  if (authStatus !== "authenticated") {
    alert("Please login to make contact request");
    setLocation("/signin");
    return;
  }
  setIsModalOpen(true);
};

const submitContactRequest = async () => {
  if (!fullName || !phoneNumber) {
    alert("Please fill in all fields");
    return;
  }

  try {
    await ApiSocket.post("/comrade/request_listing", {
      listing_id: roomId,
      full_name: fullName,
      phone_number: phoneNumber,
    });

    alert("Request submitted successfully!");
    setIsModalOpen(false);
    setFullName("");
    setPhoneNumber("");
  } catch (err) {
    console.error(err);
    alert("Failed to submit request");
  }
};



const formatKenyanPhoneForWhatsApp = (phone) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);

  return cleaned;
};

const handleShare = () => {
  const roomUrl = window.location.href; // Current page URL

  if (navigator.share) {
    // Native Web Share API (mobile-friendly)
    navigator.share({
      title: roomData.title,
      text: `Check out this listing on CampusHub: ${roomData.title}`,
      url: roomUrl,
    }).catch(console.error);
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(roomUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  }
};







  if (loading || !roomData) return <SkeletonLoading />;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading room data</div>;

  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link href="/listings">
              <Button variant="ghost" className="gap-2 -ml-4">
                <ChevronLeft className="w-4 h-4" />
                Back to listings
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left/Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images & Gallery */}
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-muted">
                <img 
                  src={roomData.images[currentImage]}
                  alt={roomData.title}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {roomData.verified && (
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {roomData.type}
                  </Badge>
                </div>
                {/* Favorite & Share */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-muted-foreground hover:text-red-500"
                    }`}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>

                  {/* <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button> */}
                  <button
  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
  onClick={handleShare}
>
  <Share2 className="w-5 h-5" />
</button>


                </div>
                {/* Image Navigation */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <button 
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white transition-colors disabled:opacity-50"
                    onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
                    disabled={currentImage === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {roomData.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImage ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setCurrentImage(index)}
                      />
                    ))}
                  </div>
                  <button 
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white transition-colors disabled:opacity-50"
                    onClick={() => setCurrentImage(Math.min(roomData.images.length - 1, currentImage + 1))}
                    disabled={currentImage === roomData.images.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-3">
              {roomData.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImage ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

              {/* Room Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{roomData.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {roomData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {roomData.rating} ({roomData.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Room Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Ruler className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold">{roomData.size}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Max Occupants</p>
                  <p className="font-semibold">{roomData.maxOccupants}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{roomData.distance}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="font-semibold">{roomData.availableFrom}</p>
                </div>
              </div>

              {/* Amenities */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roomData.amenities.map((amenity) => (
                      <div 
                        key={amenity.name}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          amenity.available ? "bg-primary/5" : "bg-muted/50 opacity-50"
                        }`}
                      >
                        <amenity.icon className={`w-5 h-5 ${amenity.available ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={amenity.available ? "" : "line-through"}>{amenity.name}</span>
                        {amenity.available && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{roomData.description}</p>
                </CardContent>
              </Card>

              {/* Deposit */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Deposit</h2>
                  <div className="space-y-1">
                    {Object.entries(roomData.deposit).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.trim()}</span>
                        <span>KES {Number(val).toLocaleString()}</span>
                      </div>
                    ))}
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>KES {roomData.depositTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{roomData.rating}</span>
                      <span className="text-muted-foreground">({roomData.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {roomData.reviewsList.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
                    {roomData.reviewsList.map((review) => (
                      <div key={review.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{review.author}</span>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-6">
                    View All {roomData.reviews} Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-border/50 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-primary">KES {Number(roomData.price).toLocaleString()}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Deposit: KES {roomData.depositTotal.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                <Button className="w-full h-12 gap-2" size="lg" onClick={handleContactRequest}>
                  <Calendar className="w-5 h-5" />
                  Contact Request
                </Button>
                    {/* <Button variant="outline" className="w-full h-12 gap-2" size="lg">
                      <MessageCircle className="w-5 h-5" />
                      Message Landlord
                    </Button> */}
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={roomData.landlord.image} />
                        <AvatarFallback>{roomData.landlord.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{roomData.landlord.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {roomData.landlord.properties} properties
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response rate</span>
                        <span className="font-medium text-primary">{roomData.landlord.responseRate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Response time</span>
                        <span className="font-medium">{roomData.landlord.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-medium">{roomData.landlord.memberSince}</span>
                      </div>
                    </div>
{/* 
                    <Button variant="ghost" className="w-full mt-4 gap-2">
                      <Phone className="w-4 h-4" />
                      Show Phone Number
                    </Button> */}

          {!showPhone ? (
            <Button
              variant="ghost"
              className="w-full mt-4 gap-2"
              onClick={handleShowPhone}
            >
              <Phone className="w-4 h-4" />
              Show Phone Number
            </Button>
          ) : (
            <div className="space-y-2 mt-4">

                <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/50 w-fit hover:bg-muted/40 transition-colors cursor-pointer" id="padd">
      <Phone className="w-5 h-5 text-primary" />
      <a
        href={`tel:${roomData.landlord.phoneNumber || "0113899517"}`}
        className="text-sm font-medium text-foreground hover:text-primary"
      >
        {roomData.landlord.phoneNumber || "0113899517"}
      </a>
    </div>


              {/* <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={() =>
                  window.location.href = `tel:${roomData.landlord.phoneNumber}`
                }
              >
                <Phone className="w-4 h-4" />
                Call {roomData.landlord.phoneNumber}
              </Button> */}

<Button
  variant="outline"
  className="w-full gap-2"
  onClick={() => {
    const phone = formatKenyanPhoneForWhatsApp(roomData.landlord.phoneNumber);

    const message = encodeURIComponent(
      `Hi ${roomData.landlord.name}, I'm interested in your room "${roomData.title}" on CampusHub. Is it still available?`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }}
>
  WhatsApp Landlord
</Button>

            </div>
          )}


                  </div>

                  {/* <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      Quick Inquiry
                    </div>
                    <Textarea 
                      placeholder="Hi, I'm interested in this room. Is it still available?"
                      className="mb-3 resize-none"
                      rows={3}
                    />
                    <Button className="w-full">
                      Send Inquiry
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Contact Request</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 rounded bg-gray-300"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-primary text-white"
          onClick={submitContactRequest}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
}

