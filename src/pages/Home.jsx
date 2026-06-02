import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import LoadingScreen from "@/pages/Auth/LoadingScreen"
import { ApiSocket} from "@/utils/ApiSocket";
import SkeletonLoading from "@/components/SkeletonLoading";
import { Helmet } from "react-helmet";
import { 
  Search, 
  Shield, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  Building2, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/student_housing_hero_image.png";
import { useEffect } from "react";
import hero1 from "@assets/generated_images/hero1.jpeg";
import hero2 from "@assets/generated_images/hero2.jpeg";
import hero3 from "@assets/generated_images/hero3.jpeg";
// import ApiSocket from "@/utils/ApiSocket";
import { useState } from "react";
// import PageTracker from "@/components/PageTracker";
import PageTracker from "../components/PageTracker";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is physically inspected by our team for safety, cleanliness, and quality.",
  },
  {
    icon: MapPin,
    title: "Campus-Centric",
    description: "Find rooms based on distance from your university. No more long commutes to lectures.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Browse hundreds of verified rooms online instead of wandering around neighborhoods.",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description: "Read honest reviews from fellow students who've lived in these properties.",
  },
];

const stats = [
  { value: "0+", label: "Verified Rooms" },
  { value: "0+", label: "Happy Students" },
  { value: "0+", label: "Trusted Landlords" },
  { value: "0+", label: "Partner Campuses" },
];

const steps = [
  { step: 1, title: "Create Account", description: "Sign up for free in under 2 minutes" },
  { step: 2, title: "Set Preferences", description: "Tell us your budget, room type & preferred distance" },
  { step: 3, title: "Browse & Book", description: "View verified listings and schedule viewings" },
  { step: 4, title: "Move In", description: "Chat with landlords, reserve, and move into your new home" },
];

const heroImages = [hero1, hero2, hero3];




// const [data, setData] = useState("");

// run useeffect to connect to socket on mount

// useEffect(() => {
//   ApiSocket.get("/comrade/get_listings").then(console.log);
// }, []);


export default function Home() {
   const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
   const [favorites, setFavorites] = useState([]);

   const [featuredRooms, setFeaturedRooms] = useState([])
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


  useEffect(() => {
  setFavorites(getLocalFavorites());
}, []);

const toggleFavorite = (roomId) => {
  setFavorites((prev) => {
    let updated;

    if (prev.includes(roomId)) {
      updated = prev.filter((id) => id !== roomId);
    } else {
      updated = [...prev, roomId];
    }

    setLocalFavorites(updated);
    return updated;
  });
};




   

   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 120000); // 2 minutes = 120,000 ms

    return () => clearInterval(interval);
  }, []);

  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

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
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)


  function formatDistance(meters) {
  const m = Number(meters);

  if (!Number.isFinite(m) || m < 0) return null;

  if (m < 1000) {
    return `${Math.round(m)} m`;
  }

  const km = m / 1000;

  // show up to 2 decimals, but trim trailing zeros
  const formatted = km.toFixed(2).replace(/\.?0+$/, "");

  return `${formatted} km`;
}


useEffect(() => {
  if (coordinates.latitude && coordinates.longitude) {
    const fetchListings = async () => {
      try {
        setLoading(true);

        const response = await ApiSocket.post("/comrade/get_listings", {
          coordinates: coordinates
        });

        console.log("Fetched listings RAW:", response);

        const mapped = (response.data?.listings || response.listings || []).map((l) => ({
          id: l.listing_id,
          title: l.listing_name,

          type: l.listing_type
            ? l.listing_type.charAt(0).toUpperCase() + l.listing_type.slice(1)
            : "Unknown",

          price: Number(l.price),

          location: l.location?.address || "Unknown",

          distance: formatDistance(l.distance),

          image: l.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",

          amenities: Array.isArray(l.amenities)
            ? l.amenities.map(a => a.name || a.label || String(a))
            : [],

          verified: Boolean(l.verified),

          rating: Number(l.rating?.average_rating || 0),
          reviews: Number(l.rating?.num_ratings || 0),

          status: l.availability_status?.trim()?.toLowerCase() || "available",
          availability_date: l.availability_date || null,
        }));


        setFeaturedRooms(mapped);
        setError(null);

      } catch (error) {
        setError(error.message || "Unknown error");
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }
}, [coordinates]);


//  if (loading || (!coordinates.latitude && !coordinates.longitude)) {
//   return <SkeletonLoading />;
// }

//  <PageTracker page="home" />
  return (
    <div className="min-h-screen bg-background">

      <Helmet>
          <title>
            CampusHub Kenya | Verified Student Hostels, Bedsitters & Rentals
          </title>

          <meta
            name="description"
            content="Find verified hostels, bedsitters and student accommodation near universities in Kenya. Compare rooms, prices, amenities and locations on CampusHub."
          />

          <link
            rel="canonical"
            href="https://campushub.yreen.co.ke/"
          />

          <meta property="og:title" content="CampusHub Kenya" />
          <meta
            property="og:description"
            content="Find verified student accommodation near universities in Kenya."
          />
          <meta
            property="og:url"
            content="https://campushub.yreen.co.ke/"
          />
          <meta
            property="og:image"
            content="https://campushub.yreen.co.ke/favicon.png"
          />
          <meta property="og:type" content="website" />
        </Helmet>

      <PageTracker page="home" />
      <Navbar />
      
      <section className="relative pt-16 overflow-hidden">
       <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${heroImages[currentHeroIndex]})` }}
        />

        <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Trusted 
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="text-gradient block">Campus Home</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              The safest way to find verified, affordable off-campus housing near your university. 
              No scams. No surprises. Just quality student accommodation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by location or university..."
                  className="pl-12 h-14 text-base bg-card border-border"
                  data-testid="input-search-hero"
                />
              </div>
              <Link href="/listings">
                <Button size="lg" className="h-14 px-8 gap-2" data-testid="button-search-hero">
                  Find Rooms
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Free to browse
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Verified listings
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No hidden fees
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* check this section */}

      {/* <section className="py-12 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students Love CampusHub
            </h2>
            <p className="text-muted-foreground text-lg">
              We've built the platform that students actually need for finding safe, affordable housing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Rooms</h2>
              <p className="text-muted-foreground">Hand-picked verified listings near popular campuses</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="gap-2" data-testid="button-view-all">
                View All Listings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

{loading ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonLoading key={i} />
    ))}
  </div>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {featuredRooms.map((room) => (
      <RoomCard
        key={room.id}
        {...room}
        isFavorited={favorites.includes(room.id)}
        onToggleFavorite={() => toggleFavorite(room.id)}
      />
    ))}
  </div>
)}

        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Finding your next home is as easy as 1-2-3-4
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm">
                <Building2 className="w-4 h-4" />
                For Property Owners
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Are You a Landlord?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join CampusHub and get direct access to thousands of students looking for accommodation. 
                List your property, get verified, and enjoy higher occupancy rates.
              </p>
              <ul className="space-y-3">
                {[
                  "Reach more students actively searching",
                  "Get verified for increased trust",
                  "Manage bookings & inquiries easily",
                  "Flexible subscription plans from KES 300/month",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/80" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/landlord-dashboard">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="gap-2 bg-white text-primary hover:bg-white/90"
                  data-testid="button-list-property"
                >
                  <Users className="w-5 h-5" />
                  List Your Property
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-white/10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                  alt="Landlord"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
