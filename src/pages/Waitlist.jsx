// src/pages/Waitlist.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Waitlist() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    campus: "",
    budget: "",
    location: "",
    moveIn: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("DATA:", form);
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">
            You're In 🚀
          </h1>
          <p className="text-muted-foreground">
            We’ll match you with listings that fit your budget and location.
            Expect faster updates via your phone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl h-[580px] flex items-center">

        {/* RIGHT IMAGE */}
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
          <img
            src="/images/hostel.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white"></div>
        </div>

        {/* LEFT CONTENT */}
        <div className="absolute left-0 w-1/2 p-10 z-10">

          {/* HEADLINE */}
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Find Student Housing Faster
          </h1>

          {/* SUBTEXT */}
          <p className="text-muted-foreground mb-6">
            Skip the endless searching. Tell us what you need and get matched to available listings that fit your budget and location.
          </p>

          {/* TRUST POINTS */}
          <div className="flex flex-col gap-2 mb-6 text-sm">
            <p>⚡ Get matched faster</p>
            <p>📍 Listings near your campus</p>
            <p>✅ Verified options only</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (07XXXXXXXX)"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              name="campus"
              placeholder="Campus (e.g. UON, KU)"
              value={form.campus}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="number"
              name="budget"
              placeholder="Monthly Budget (KES)"
              value={form.budget}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              name="location"
              placeholder="Preferred Location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="date"
              name="moveIn"
              value={form.moveIn}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            <Button className="w-full mt-2" disabled={loading}>
              {loading ? "Submitting..." : "Get Priority Access"}
            </Button>
          </form>

          {/* URGENCY */}
          <p className="text-xs text-muted-foreground mt-3">
            Limited early access. We’re currently onboarding students before listings go live.
          </p>

        </div>
      </div>
    </div>
  );
}