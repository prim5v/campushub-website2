import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import ApiSocket from "@/utils/ApiSocket";
import { useDashboard } from "@/contexts/DashboardContext";

export default function AddListingModal({ open, onClose, onSuccess }) {
  const [listingName, setListingName] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingType, setListingType] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const { data } = useDashboard();

  // ✅ New fields
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [timeline, setTimeline] = useState("monthly");
  const [roomSize, setRoomSize] = useState("");
  const [maxOccupants, setMaxOccupants] = useState("");
  const [allAmenities, setAllAmenities] = useState([]); // fetched from backend
  const [selectedAmenities, setSelectedAmenities] = useState([]); // checked by user

  const [deposits, setDeposits] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch landlord properties & amenities
  useEffect(() => {
    if (!open) return;

    const fetchProperties = async () => {
      try {
        const res = await ApiSocket.get("/landlord/get_properties");
        setProperties(res.properties || []);
        setAllAmenities(res.amenities || []);
        if (res.properties?.[0]) setPropertyId(res.properties[0].property_id);
      } catch (err) {
        console.error("Failed to load properties or amenities:", err);
      }
    };

    fetchProperties();
  }, [open]);

  // --------------------
  // Deposits helpers
  // --------------------
  const addDepositRow = () => setDeposits([...deposits, { key: "", value: "" }]);
  const removeDepositRow = (index) =>
    setDeposits(deposits.filter((_, i) => i !== index));
  const updateDeposit = (index, field, value) => {
    const updated = [...deposits];
    updated[index][field] = value;
    setDeposits(updated);
  };

  const buildDepositsObject = () => {
    const obj = {};
    deposits.forEach((d) => {
      if (d.key && d.value) obj[d.key] = d.value;
    });
    return obj;
  };

  // --------------------
  // Availability logic
  // --------------------
  useEffect(() => {
    if (availabilityStatus === "available") setAvailabilityDate("");
  }, [availabilityStatus]);

  // --------------------
  // Amenities helpers
  // --------------------
  const toggleAmenity = (amenityKey) => {
    if (selectedAmenities.includes(amenityKey)) {
      setSelectedAmenities(selectedAmenities.filter((k) => k !== amenityKey));
    } else {
      setSelectedAmenities([...selectedAmenities, amenityKey]);
    }
  };

  // --------------------
  // Handle submit
  // --------------------
  const handleSubmit = async () => {
    setError("");

    if (!listingName || !listingDescription || !listingType || !price || !propertyId) {
      setError("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      setError("At least one listing image is required");
      return;
    }

    if (!roomSize || !maxOccupants) {
      setError("Please provide room size and maximum occupants");
      return;
    }

    const formData = new FormData();
    formData.append("listing_name", listingName);
    formData.append("listing_description", listingDescription);
    formData.append("listing_type", listingType);
    formData.append("price", parseFloat(price));
    formData.append("property_id", propertyId);

    // New fields
    formData.append("availability_status", availabilityStatus);
    formData.append("availability_date", availabilityDate || null);
    formData.append("timeline", timeline);
    formData.append("room_size", roomSize);
    formData.append("max_occupants", maxOccupants);

    // Amenities JSON
    formData.append("amenities", JSON.stringify(selectedAmenities));

    // Deposits JSON
    formData.append("deposits", JSON.stringify(buildDepositsObject()));

    if (availabilityStatus === "rented" && !availabilityDate) {
      setError("Please select when the listing will be available.");
      return;
    }

    images.forEach((img) => formData.append("product_images", img));

    try {
      setLoading(true);
      await ApiSocket.post("/landlord/add_listing", formData, { isFormData: true });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || "Failed to add listing");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
if (properties.length === 0) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="bg-yellow-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-800">
            No Properties Found
          </h2>

          {/* Description */}
          <p className="text-gray-600">
            You need to add at least one property before you can create a listing.
          </p>

          {/* Action Button */}
          <button
            onClick={() => {
              // Close this modal and open the Add Property flow
              onClose();
              setTimeout(() => {
                // Assuming you have a parent handler to open AddPropertyModal
                document.getElementById("open-add-property")?.click();
              }, 100);
            }}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow"
          >
            back
          </button>
        </div>
      </Card>
    </div>
  );
}


  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Add New Listing</h2>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
          )}

          {/* Name & Description */}
          <Input placeholder="Listing name" value={listingName} onChange={(e) => setListingName(e.target.value)} />
          <Textarea placeholder="Description" value={listingDescription} onChange={(e) => setListingDescription(e.target.value)} />

          {/* Property selection */}
          <div className="space-y-1">
            {properties.map((prop) => (
              <label key={prop.property_id} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={propertyId === prop.property_id}
                  onChange={() => setPropertyId(prop.property_id)}
                />
                {prop.property_name}
              </label>
            ))}
          </div>

          {/* Type & Price */}
          <Select value={listingType} onValueChange={setListingType}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bedsitter">Bedsitter</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

          {/* Availability */}
          <Select value={availabilityStatus} onValueChange={setAvailabilityStatus}>
            <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
          {availabilityStatus === "rented" && (
            <Input
              type="date"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          )}

          {/* Timeline */}
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger><SelectValue placeholder="Timeline" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {/* Room Size & Max Occupants */}
          <div className="flex gap-2">
            <Input placeholder="Room size (e.g., 18 sqm)" value={roomSize} onChange={(e) => setRoomSize(e.target.value)} />
            <Input type="number" placeholder="Max occupants" value={maxOccupants} onChange={(e) => setMaxOccupants(e.target.value)} />
          </div>

          {/* Amenities as checkboxes */}
          <div className="space-y-2 border p-3 rounded">
            <div className="font-medium">Amenities</div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {allAmenities.map((a) => (
                <label key={a.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a.amenity_key)}
                    onChange={() => toggleAmenity(a.amenity_key)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>

          {/* Deposits */}
          <div className="space-y-2 border p-3 rounded">
            <div className="font-medium">Deposits (Key / Value)</div>
            {deposits.map((dep, index) => (
              <div key={index} className="flex gap-2">
                <Input placeholder="e.g. security" value={dep.key} onChange={(e) => updateDeposit(index, "key", e.target.value)} />
                <Input placeholder="e.g. 5000" value={dep.value} onChange={(e) => updateDeposit(index, "value", e.target.value)} />
                <Button variant="ghost" onClick={() => removeDepositRow(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addDepositRow} className="w-full gap-2">
              <Plus className="w-4 h-4" /> Add Deposit Field
            </Button>
          </div>

          {/* Images */}
          <Input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Uploading..." : "Add Listing"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
