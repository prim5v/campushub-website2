import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import LoadingScreen from "@/pages/Auth/LoadingScreen"
import { ApiSocket} from "@/utils/ApiSocket";
import SkeletonLoading from "@/components/SkeletonLoading";
import CountdownBanner from "@/components/CountdownBanner";
import { Helmet } from "react-helmet"; // make sure you have react-helmet installed
import listingsJSON from "../../public/listings.json";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  X, 
  Grid3X3, 
  List,
  ChevronDown
} from "lucide-react";



const roomTypes = ["All Types", "Single Room", "Bedsitter", "Studio", "1 Bedroom", "2 Bedroom", "Shared"];
const distances = ["Any Distance", "< 500m", "< 1km", "< 2km", "< 5km"];

export default function Listings() {
  const [ allRooms, setAllRooms ] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedDistance, setSelectedDistance] = useState("Any Distance");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // removed TypeScript type
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState([]);


  

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

  

  const filteredRooms = allRooms.filter((room) => {
    if (verifiedOnly && !room.verified) return false;
    if (selectedType !== "All Types" && room.type !== selectedType) return false;
    if (room.price < priceRange[0] || room.price > priceRange[1]) return false;
    if (searchQuery && !room.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !room.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  

  

  const activeFiltersCount = [
    selectedType !== "All Types",
    selectedDistance !== "Any Distance",
    verifiedOnly,
    priceRange[0] > 0 || priceRange[1] < 30000,
  ].filter(Boolean).length;
  
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

        const mapped = (response.listings || []).map((l) => ({
          id: l.listing_id,
          title: l.listing_name,

          type: l.listing_type
            ? l.listing_type.charAt(0).toUpperCase() + l.listing_type.slice(1)
            : "Unknown",

          price: Number(l.price),

          location: l.location?.address || "Unknown",

          distance: formatDistance(l.distance),

          // image: l.images?.[0] || "/placeholder.jpg",
          image: l.images?.[0] || "https://campushub-website.vercel.app/placeholder.jpg",


          amenities: Array.isArray(l.amenities)
            ? l.amenities.map(a => a.name || a.label || String(a))
            : [],

          verified: Boolean(l.verified),

          rating: Number(l.rating?.average_rating || 0),
          reviews: Number(l.rating?.num_ratings || 0),
        }));


        setAllRooms(mapped);
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






// const generateListingsJSONLD = () => {
//   return {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     "itemListElement": allRooms.map((room, index) => ({
//       "@type": "ListItem",
//       "position": index + 1,
//       "url": `https://campushub-website.vercel.app/room/${room.id}`,
//       "item": {
//         "@type": "Product",
//         "name": room.title,
//         "image": room.image,
//         "description": `Verified ${room.type} near campus at ${room.location}`,
//         "offers": {
//           "@type": "Offer",
//           "price": room.price,
//           "priceCurrency": "KES",
//           "availability": "https://schema.org/InStock"
//         }
//       }
//     }))
//   };
// };



  return (
    <div className="min-h-screen bg-background">
      {allRooms.length > 0 && (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(listingsJSON)}
    </script>
  </Helmet>
)}

      <Navbar />

      
  {/* Show banner only if there are no listings */}
  {/* and loading is false */}
  {filteredRooms.length === 0 && !loading && <CountdownBanner durationDays={7} />}

  {allRooms.length === 0 && !loading && <CountdownBanner durationDays={7} />}    
  
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Rooms</h1>
            <p className="text-muted-foreground">
              {filteredRooms.length} verified rooms available near your campus
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by location, title, or campus..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 w-45" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"} transition-colors`}
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  className={`p-3 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"} transition-colors`}
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-8 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filter Results</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedType("All Types");
                      setSelectedDistance("Any Distance");
                      setVerifiedOnly(false);
                      setPriceRange([0, 1000000]);
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Room Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger data-testid="select-room-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Distance from campus</label>
                    <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                      <SelectTrigger data-testid="select-distance">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {distances.map((dist) => (
                          <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Price Range: KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={100000}
                      step={500}
                      className="mt-6"
                      data-testid="slider-price"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Other Filters</label>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="verified" 
                        checked={verifiedOnly}
                        onCheckedChange={(checked) => setVerifiedOnly(checked)}
                        data-testid="checkbox-verified"
                      />
                      <label htmlFor="verified" className="text-sm cursor-pointer">
                        Verified listings only
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedType !== "All Types" && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {selectedType}
                  <button 
                    onClick={() => setSelectedType("All Types")}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {verifiedOnly && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Verified Only
                  <button 
                    onClick={() => setVerifiedOnly(false)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 30000) && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  <button 
                    onClick={() => setPriceRange([0, 30000])}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {Array.from({ length: viewMode === "grid" ? 8 : 4 }).map((_, i) => (
              <SkeletonLoading key={i} />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                {...room}
                isFavorited={favorites.includes(room.id)}
                onToggleFavorite={() => toggleFavorite(room.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All Types");
                  setSelectedDistance("Any Distance");
                  setVerifiedOnly(false);
                  setPriceRange([0, 30000]);
                }}
                data-testid="button-reset-search"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}


          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-load-more">
              Load More Rooms
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
