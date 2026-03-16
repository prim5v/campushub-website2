import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ApiSocket from "@/utils/ApiSocket";
import { Home, Bed, Building, Users, Sparkles, DoorOpen, X, Lock, LogIn} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"
import PageTracker from "../components/PageTracker";
export default function RequestsPage() {

  const [step, setStep] = useState(1);

const [roomType, setRoomType] = useState("");
const [customRoomType, setCustomRoomType] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [maxOccupants, setMaxOccupants] = useState(0);
  const [priceRange, setPriceRange] = useState("");
  const [minPrice, setMinPrice] = useState(3000);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [deadline, setDeadline] = useState("");

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const roomTypes = [
  {
    id: "bedsitter",
    title: "Bedsitter",
    description: "Single room with kitchen",
    icon: Home,
  },
  {
    id: "1bedroom",
    title: "1 Bedroom",
    description: "Bedroom + living room",
    icon: DoorOpen,
  },
  {
    id: "apartment",
    title: "Apartment",
    description: "Multi-room apartment",
    icon: Building,
  },
  {
    id: "hostel",
    title: "Hostel",
    description: "Student hostel room",
    icon: Bed,
  },
  {
    id: "shared",
    title: "Shared",
    description: "Shared with roommates",
    icon: Users,
  },
  {
    id: "others",
    title: "Others",
    description: "Describe what you want",
    icon: Sparkles,
  },
];
  const { authStatus } = useAuth()
  const [submitted, setSubmitted] = useState(false)




  const selectRoomSize = (size) => {

  setRoomSize(size);

  if (size === "small") setMaxOccupants(1);
  if (size === "medium") setMaxOccupants(2);
  if (size === "large") setMaxOccupants(3);

};

const selectRoomType = (type) => {

  setRoomType(type);

  if (type !== "others") {
    setCustomRoomType("");
  }

};

  /* ---------------- Fetch Amenities ---------------- */

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const res = await ApiSocket.get("/comrade/get_amenities");
        setAllAmenities(res.amenities || []);
      } catch (err) {
        console.error("Failed to load amenities", err);
      }
    };

    loadAmenities();
  }, []);

  /* ---------------- Cleanup Preview URLs ---------------- */

useEffect(() => {
  return () => {
    previewImages.forEach((url) => URL.revokeObjectURL(url));
  };
}, [previewImages]);

  /* ---------------- Toggle Amenities ---------------- */

  const toggleAmenity = (key) => {
    if (selectedAmenities.includes(key)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== key));
    } else {
      setSelectedAmenities([...selectedAmenities, key]);
    }
  };

  /* ---------------- Image Upload ---------------- */

  const handleImages = (e) => {

    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);

    if (file.size > 5 * 1024 * 1024) {
  setError("Image must be less than 5MB");
}

    

  };

  const removeImage = (index) => {

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviewImages(newPreviews);

  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = async () => {

    if (!agree) {
      setError("You must agree to the service fee before submitting.");
      return;
    }

    if (!phone) {
      setError("Please provide a phone number so we can contact you.");
      return;
    }  
    if (phone.length < 10) {
  setError("Please enter a valid phone number.");
  return; 
    }
    if (!deadline) {
  setError("Please select when you need the room.");
  return;
    }
    if (!title || !description) {
  setError("Please fill in title and description.");
  return;
}

    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

 const finalRoomType =
  roomType === "others" ? customRoomType : roomType;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("phone", phone);
    formData.append("room_type", finalRoomType);
    formData.append("room_size", roomSize);
    formData.append("max_occupants", maxOccupants);
    formData.append("price_range", `${minPrice}-${maxPrice}`);
    formData.append("deadline", deadline);

    formData.append("amenities", JSON.stringify(selectedAmenities));

    images.forEach(img => formData.append("room_images", img));

    try {
        console.log(formData)

      setLoading(true);

      await ApiSocket.post("/comrade/room_request", formData, {
        isFormData: true
      });

      setError("")
      setSubmitted(true)
      alert("Room request submitted successfully!");
      

    } catch (err) {

      console.error(err);
      setError(err?.response?.data?.error || "Failed to submit request");

    } finally {

      setLoading(false);

    }

  };


  if (submitted) {
  return (
    <div className="max-w-xl mx-auto p-6">
      <PageTracker page="Room request-success" />
      
      <Card className="shadow-sm border">
        <CardContent className="p-8 text-center space-y-5">

          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <Home className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold">
            Request Submitted
          </h2>

          {/* Message */}
          <p className="text-sm text-muted-foreground">
            Your room request has been successfully submitted.
            <br />
            CampusHub will review it and reach out to you once we find
            a room that matches your request.
          </p>

          {/* Extra Info */}
          <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
            Make sure your phone is reachable so we can contact you
            when a match is found.
          </div>

          {/* Button */}
          <Button
            className="w-full"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
  

  if (authStatus === "unauthenticated" || authStatus === "idle") {
  return (
    <div className="max-w-md mx-auto p-6">
      <PageTracker page="Room request sign-in" />

  <Card className="shadow-sm border">

    <CardContent className="p-8 text-center space-y-5">

      {/* Icon */}
      <div className="flex justify-center">
        <div className="bg-muted p-4 rounded-full">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold">
        Sign in to Make a Room Request
      </h2>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        You need to be signed in before creating a room request.
        This helps CampusHub contact you when we find a match.
      </p>

      {/* Button */}
      <Button
        className="w-full flex items-center justify-center gap-2"
        onClick={() => window.location.href = "/signin"}
      >
        <LogIn className="w-4 h-4" />
        Go to Sign In
      </Button>

    </CardContent>

  </Card>

</div>
  );
}

  return (

    // <div className="max-w-3xl mx-auto p-6">
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      <PageTracker page="Room request" />
        <div className="md:col-span-2">

      <Card className="shadow-xl">
        <CardContent className="p-8 space-y-6">

          <h1 className="text-2xl font-bold text-center">
            Make a Room Request
          </h1>

          {/* Progress Bar */}

          <div className="w-full bg-muted h-2 rounded">
            <div
              className="bg-primary h-2 rounded transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* ---------------- STEP 1 ---------------- */}

          {step === 1 && (

            <div className="space-y-6">

            <div className="space-y-4">

  {/* Title */}
  <div>
    <h3 className="font-semibold text-lg">
      What type of room are you looking for?
    </h3>

    <p className="text-sm text-muted-foreground">
      Choose the option that best matches your ideal room.
    </p>
  </div>

  {/* Room Type Grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

    {roomTypes.map((type) => {

      const Icon = type.icon;

      return (
        <button
          key={type.id}
          onClick={() => selectRoomType(type.id)}
          className={`p-4 rounded-xl border text-left transition-all hover:shadow-md hover:scale-[1.03]

          ${
            roomType === type.id
              ? "border-primary bg-primary/10 scale-[1.03]"
              : "hover:border-primary"
          }`}
        >

          <div className="flex items-center gap-2 mb-2">

            <Icon className="w-5 h-5 text-primary" />

            <span className="font-medium">
              {type.title}
            </span>

          </div>

          <p className="text-xs text-muted-foreground">
            {type.description}
          </p>

        </button>
      );

    })}

  </div>

  {/* Custom Room Type Input */}

  {roomType === "others" && (

    <div className="space-y-2">

      <Input
        placeholder="Describe the room you want (e.g. studio loft, single room)"
        value={customRoomType}
        onChange={(e) => setCustomRoomType(e.target.value)}
      />

      <p className="text-xs text-muted-foreground">
        Example: studio loft, servant quarter, partitioned bedsitter
      </p>

    </div>

  )}

</div>

              <Button
                className="w-full"
                disabled={!roomType}
                onClick={() => setStep(2)}
              >
                Next
              </Button>

            </div>

          )}

          {/* ---------------- STEP 2 ---------------- */}

          {step === 2 && (

            <div className="space-y-4">

              <h2 className="text-lg font-medium text-center">
                Your Preferences
              </h2>

             <div className="space-y-3">

  <div className="font-medium">
    Room Size
  </div>

  <div className="grid grid-cols-3 gap-3">

    {/* Small */}
    <button
      onClick={() => selectRoomSize("small")}
      className={`p-4 rounded-xl border text-center transition
      ${roomSize === "small"
        ? "border-primary bg-primary/10"
        : "hover:border-primary"}
      `}
    >
      <div className="font-medium">Small</div>
      <div className="text-xs text-muted-foreground">
        Fits 1 person
      </div>
    </button>

    {/* Medium */}
    <button
      onClick={() => selectRoomSize("medium")}
      className={`p-4 rounded-xl border text-center transition
      ${roomSize === "medium"
        ? "border-primary bg-primary/10"
        : "hover:border-primary"}
      `}
    >
      <div className="font-medium">Medium</div>
      <div className="text-xs text-muted-foreground">
        Fits 1–2 people
      </div>
    </button>

    {/* Large */}
    <button
      onClick={() => selectRoomSize("large")}
      className={`p-4 rounded-xl border text-center transition
      ${roomSize === "large"
        ? "border-primary bg-primary/10"
        : "hover:border-primary"}
      `}
    >
      <div className="font-medium">Large</div>
      <div className="text-xs text-muted-foreground">
        Fits 2–3 people
      </div>
    </button>

  </div>

</div>

<div className="space-y-2">

  <div className="font-medium">
    Price Range (KSh)
  </div>

  <div className="flex justify-between text-sm text-muted-foreground">
    <span>Min: KSh {minPrice}</span>
    <span>Max: KSh {maxPrice}</span>
  </div>

  {/* Min slider */}
  <label htmlFor="">Minumum</label>
  <input
    type="range"
    min="1000"
    max="20000"
    step="500"
    value={minPrice}
    onChange={(e) => {
  const value = Number(e.target.value);
  if (value < maxPrice) setMinPrice(value);
  setError("");
}}
    className="w-full"
  />

  {/* Max slider */}
  <label htmlFor="">Maximum</label>
  <input
    type="range"
    min="1000"
    max="20000"
    step="500"
    value={maxPrice}
    onChange={(e) => {
  const value = Number(e.target.value);
  if (value > minPrice) setMaxPrice(value);
  setError("");
}}
    className="w-full"
  />

</div>

              {/* Amenities */}

              <div className="space-y-2">

                <div className="font-medium">
                  Preferred Amenities
                </div>

                <div className="flex flex-wrap gap-2">

                  {allAmenities.map(a => (

                    <button
                      key={a.id}
                      onClick={() => toggleAmenity(a.amenity_key)}
                      className={`px-3 py-1 rounded-full border text-sm transition
                      ${selectedAmenities.includes(a.amenity_key)
                        ? "bg-primary text-white"
                        : "hover:border-primary"}
                      `}
                    >
                      {a.label}
                    </button>

                  ))}

                </div>

              </div>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>

                <Button
                  className="w-full"
                  onClick={() => setStep(3)}
                >
                  Next
                </Button>

              </div>

            </div>

          )}

          {/* ---------------- STEP 3 ---------------- */}

          {step === 3 && (

            <div className="space-y-4">
              {/* Contact Info */}

              <div className="space-y-2">

                <label className="text-sm font-medium">
                  Contact Phone Number
                </label>

                <Input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setError("")
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  We will use this number to contact you when a room is available.
                </p>

              </div>

              <Input
                placeholder="eg. Bedsitter room near Ruiru "
                value={title}
                onChange={(e) => {setTitle(e.target.value)
                    setError("");
                }
                    
                }
              />

              <Textarea
                placeholder="Describe the room you want"
                value={description}
                onChange={(e) => {setDescription(e.target.value)
                    setError("");
                }}
              />

                <div className="space-y-3">

                <div>
                    <h3 className="font-semibold text-lg">
                    📅 When do you need the room?
                    </h3>

                    <p className="text-sm text-muted-foreground">
                    Select the latest date you would like CampusHub to secure a room for you.
                    </p>
                </div>

                <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="max-w-sm"
                />

                <p className="text-xs text-muted-foreground">
                    We’ll try to find a room before this date.
                </p>

                </div>

              {/* Image Upload */}

              <div className="text-sm text-muted-foreground">
                Upload images that clearly show the type of room you want.
                This helps CampuHub understand your request better.
              </div>

              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
              />

              {/* Preview */}

              {previewImages.length > 0 && (

                <div className="grid grid-cols-3 gap-3">

                  {previewImages.map((src, index) => (

                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden"
                    >

                      <img
                        src={src}
                        className="w-full h-24 object-cover"
                      />

                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded"
                      >
                        <X size={14}/>
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {/* Agreement */}

              <label className="flex items-start gap-2 text-sm">

                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />

                I agree to pay <b>KSh 750</b> after CampusHub successfully
                delivers a room that matches my request.

              </label>
{/* 
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )} */}
              {/* ERROR MESSAGE */}

                {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">

                    <div className="font-medium">
                    Submission Failed
                    </div>

                    <div>
                    {error}
                    </div>

                </div>

                )}


              <div className="flex gap-2">

                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>

              </div>

            </div>

          )}

          

        </CardContent>

        
      </Card>
      
      </div>
      <Card className="hidden md:block h-fit sticky top-6">

  <CardContent className="p-6 space-y-4">

    <h2 className="font-semibold text-lg">
      Request Summary
    </h2>

    <div className="space-y-2 text-sm">

      <div className="flex justify-between">
        <span className="text-muted-foreground">Room Type</span>
        <span className="font-medium">
          {roomType === "others" ? customRoomType || "—" : roomType || "—"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Room Size</span>
        <span className="font-medium">
          {roomSize || "—"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Max Occupants</span>
        <span className="font-medium">
          {maxOccupants || "—"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Price Range</span>
        <span className="font-medium">
          KSh {minPrice} – {maxPrice}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">Deadline</span>
        <span className="font-medium">
          {deadline || "—"}
        </span>
      </div>

      <div>

        <span className="text-muted-foreground text-xs">
          Amenities
        </span>

        <div className="flex flex-wrap gap-1 mt-1">

          {selectedAmenities.length === 0 && (
            <span className="text-xs text-muted-foreground">
              None selected
            </span>
          )}

          {selectedAmenities.map((a) => (

            <span
              key={a}
              className="text-xs bg-muted px-2 py-1 rounded"
            >
              {a}
            </span>

          ))}

        </div>

      </div>

    </div>

    <div className="pt-3 border-t text-xs text-muted-foreground">
      This summary updates automatically as you fill the form.
    </div>

  </CardContent>

</Card>

    </div>
  );
}