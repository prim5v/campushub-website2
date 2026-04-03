// src/pages/GetBadge.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLandlord } from "@/contexts/LandlordContext";

export default function GetBadge() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [loading, setLoading] = useState(true);
  const freeOffer = true;
  const { badgeShown, setBadgeShown } = useLandlord();

  const slides = [
    {
      image: "/images/badge2.jfif",
      title: "Get Verified on CampusHub",
      text: "Verified properties get more student trust and faster bookings.",
    },
    {
      image: "/images/badge3.png",
      title: "Build Trust With Students",
      text: "Students prefer verified properties because they feel safe.",
    },
    {
      image: "/images/badge1.png",
      title: "Get Your Badge Today",
      text: "Pay KES 500 once and increase your bookings.",
    },
  ];


  // persist badgeShown
//   useEffect(() => {
//     localStorage.setItem("badgeShown", badgeShown.toString());
//   }, [badgeShown]);


  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide after loading
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (prev === slides.length - 1) return prev; // stop at last slide
        setAnimate(false);
        setTimeout(() => setAnimate(true), 300);
        return prev + 1;
      });
    }, 3000); // change speed here

    return () => clearInterval(interval);
  }, [loading]); // only depend on loading

  useEffect(() => {
  if (!loading && current === slides.length - 1) {
    setBadgeShown(true);
  }
}, [current, loading]);

  const nextSlide = () => {
    if (current === slides.length - 1) return;
    setAnimate(false);
    setTimeout(() => {
      setCurrent((prev) => prev + 1);
      setAnimate(true);
    }, 300);
  };

  const prevSlide = () => {
    if (current === 0) return;
    setAnimate(false);
    setTimeout(() => {
      setCurrent((prev) => prev - 1);
      setAnimate(true);
    }, 300);
  };

  // Transparent loading spinner
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/10 z-50 pointer-events-none">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl h-[500px] flex items-center">

        {/* IMAGE */}
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
          <img
            src={slides[current].image}
            className={`w-full h-full object-cover transition-all duration-700
            ${animate ? "translate-x-0 opacity-100" : "translate-x-40 opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white"></div>
        </div>

        {/* TEXT */}
        <div
          className={`absolute left-0 w-1/2 p-10 z-10 transition-all duration-700
          ${animate ? "translate-x-0 opacity-100" : "-translate-x-40 opacity-0"}`}
        >
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {slides[current].title}
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            {slides[current].text}
          </p>

          {/* LAST SLIDE: Horizontal Buttons */}
          {current === slides.length - 1 && (
            <div className="flex gap-4 mt-4">
              {freeOffer && (
                <Link href="/badge?type=free" className="flex-1">
                  <Button className="w-full"
                  onClick={() => localStorage.setItem("badge_type", JSON.stringify("free"))}>
                    Claim Free Badge
                  </Button>
                </Link>
              )}
              <Link href="/badge?type=paid" className="flex-1">
                <Button variant="outline" className="w-full"
                onClick={() => localStorage.setItem("badge_type", JSON.stringify("paid"))}>
                  Purchase Badge
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* BACK BUTTON - bottom left */}
        <div className="absolute bottom-6 left-6 z-10">
          <Button variant="outline" onClick={prevSlide}>
            Back
          </Button>
        </div>

        {/* NEXT BUTTON - bottom right */}
        <div className="absolute bottom-6 right-6 z-10">
          <Button onClick={nextSlide} disabled={current === slides.length - 1}>
            Next
          </Button>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-6 bg-primary" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}