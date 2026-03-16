import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AddPropertyModal from "@/components/landlord/AddPropertyModal";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Grid3X3,
  List,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
} from "lucide-react";

import ApiSocket from "@/utils/ApiSocket";
import PageTracker from "../PageTracker";

export default function LandlordProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  // ============================
  // Fetch properties
  // ============================
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await ApiSocket.get("/landlord/get_properties");
        console.log("Fetched properties:", res);
        setProperties(res.properties || []);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // ============================
  // Filtering (REAL FIELDS)
  // ============================
  const filteredProperties = properties.filter((p) => {
    if (verifiedOnly && !p.verified) return false;

    if (
      searchQuery &&
      !p.property_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const activeFiltersCount = [verifiedOnly].filter(Boolean).length;

  // ============================
  // Actions
  // ============================
  const handleDelete = async (propertyId) => {
    if (!confirm("Delete this property?")) return;

    try {
      await ApiSocket.delete(`/landlord/delete_property/${propertyId}`);
      setProperties((prev) => prev.filter((p) => p.property_id !== propertyId));
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <PageTracker page="Landlord properties panel"/>

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Properties</h1>
              <p className="text-muted-foreground">
                {filteredProperties.length} properties in your portfolio
              </p>
            </div>

            <Button className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>

          {/* Search + Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by property name or address..."
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
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1">{activeFiltersCount}</Badge>
                )}
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

          {/* Content */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredProperties.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredProperties.map((p) => (
                <Card key={p.property_id}>
                  <CardContent className="p-0 overflow-hidden">
                    {/* Image */}
                    <div className="aspect-video bg-muted relative">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          className="w-full h-full object-cover"
                          alt={p.property_name}
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
                          <p className="font-semibold text-lg">{p.property_name}</p>
                          <p className="text-sm text-muted-foreground">{p.address || "No address set"}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Type: {p.property_type}
                          </p>
                        </div>

                        {p.verified ? (
                          <Badge className="bg-green-100 text-green-700">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span className="flex gap-1 items-center">
                          <ImageIcon className="w-4 h-4" />
                          {p.images?.length || 0} images
                        </span>
                        <span>Listed: {p.listed_at}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleDelete(p.property_id)}
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
                <h3 className="text-xl font-semibold">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <AddPropertyModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          window.location.reload(); // simple refresh for now
        }}
      />
    </div>
  );
}
