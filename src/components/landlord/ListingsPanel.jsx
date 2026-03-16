import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Plus, Pencil, Trash2, ImageIcon, Grid3X3, List, SlidersHorizontal, Search } from "lucide-react";

import AddListingModal from "@/components/landlord/AddListingModal";
import ApiSocket from "@/utils/ApiSocket";
import PageTracker from "../PageTracker";

export default function LandlordListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  const [verifiedOnly, setVerifiedOnly] = useState(false); // optional if you have verified field

  // ============================
  // Fetch listings
  // ============================
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await ApiSocket.get("/landlord/get_listings");
      console.log("RAW RESPONSE:", res);
      const mapped = (res.listings || []).map((l) => ({
        id: l.id,
        listing_id: l.listing_id,
        name: l.listing_name,
        description: l.listing_description,
        type: l.listing_type,
        price: parseFloat(l.price),
        images: l.images || [],
        property_id: l.property_id,
        availability_status: l.availability_status || "pending",
        listed_at: l.created_at || l.listed_at || "N/A",
      }));
      setListings(mapped);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // ============================
  // Filtering
  // ============================
  const filteredListings = listings.filter((l) => {
    if (verifiedOnly && l.availability_status !== "verified") return false;
    if (
      searchQuery &&
      !l.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !l.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const activeFiltersCount = [verifiedOnly].filter(Boolean).length;

  // ============================
  // Actions
  // ============================
  const handleDelete = async (listingId) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await ApiSocket.delete(`/landlord/delete_listing/${listingId}`);
      setListings((prev) => prev.filter((l) => l.listing_id !== listingId));
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const handleEdit = (listing) => {
    console.log("Edit listing:", listing);
    // TODO: implement edit modal
  };

  return (
    <div className="min-h-screen bg-background">
      <PageTracker page="Landlord listings panel"/>
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">
                {filteredListings.length} listings in your portfolio
              </p>
            </div>

            <Button className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Listing
            </Button>
          </div>

          {/* Search + Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by listing name or description..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && <Badge className="ml-1">{activeFiltersCount}</Badge>}
              </Button>

              <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  className={`p-3 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-8 border-border/50">
              <CardContent className="p-6 grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                  <span>Verified only</span>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setVerifiedOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Listings */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredListings.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredListings.map((l) => (
                <Card key={l.id}>
                  <CardContent className="p-0 overflow-hidden">
                    {/* Image */}
                    <div className="aspect-video bg-muted relative">
                      {l.images?.[0] ? (
                        <img
                          src={l.images[0]}
                          className="w-full h-full object-cover"
                          alt={l.name}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{l.name}</p>
                          {/* <p className="text-sm text-muted-foreground">{l.description}</p> */}
                          <p className="text-xs text-muted-foreground capitalize">
                            Type: {l.type}
                          </p>
                        </div>

                        {l.availability_status === "verified" ? (
                          <Badge className="bg-green-100 text-green-700">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span className="flex gap-1 items-center">
                          <ImageIcon className="w-4 h-4" />
                          {l.images?.length || 0} images
                        </span>
                        <span>Listed: {l.listed_at}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleEdit(l)}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDelete(l.listing_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No listings found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or adding new listings</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <AddListingModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => fetchListings()} // dynamic refresh
      />
    </div>
  );
}
