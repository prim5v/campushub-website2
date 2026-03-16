// src/pages/comrade/MarketPlaceLoad.jsx
import { useEffect } from "react";
import PageTracker from "../../components/PageTracker";

export default function MarketPlaceLoad() {
  useEffect(() => {
    // Redirect AFTER animations + text display
    const timer = setTimeout(() => {
      window.open("https://swapspot-pink.vercel.app/", "_blank");   //could change with window.location
    }, 8000); // 5s merge + 5s text

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex flex-col items-center justify-center overflow-hidden">
      <PageTracker page="Marketplace loading screen"/>

      {/* Logos */}
      <div className="relative w-full h-32 mb-8 overflow-hidden">
        <img
          src="/campushub-logo.png"
          alt="CampusHub"
          className="absolute w-20 h-20 rounded-full top-1/2 animate-slide-from-left"
        />

        <img
          src="/swapspot-logo.png"
          alt="SwapSpot"
          className="absolute w-20 h-20 rounded-full top-1/2 animate-slide-from-right"
        />
      </div>

      {/* Text */}
      <p className="text-white text-2xl font-bold opacity-0 animate-text-show">
        Marketplace Powered by CampusHub & SwapSpot
      </p>

      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mt-6"></div>

      {/* Animations */}
      <style jsx>{`
        /* LEFT LOGO */
        @keyframes slideFromLeft {
          0% {
            left: -40vw;
            transform: translateY(-50%) scale(1);
          }
          70% {
            left: 50%;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* RIGHT LOGO */
        @keyframes slideFromRight {
          0% {
            right: -40vw;
            transform: translateY(-50%) scale(1);
          }
          70% {
            right: 50%;
            transform: translate(50%, -50%) scale(1.2);
          }
          100% {
            right: 50%;
            transform: translate(50%, -50%) scale(1);
          }
        }

        .animate-slide-from-left {
          animation: slideFromLeft 5s ease-in-out forwards;
        }

        .animate-slide-from-right {
          animation: slideFromRight 5s ease-in-out forwards;
        }

        /* TEXT */
        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-text-show {
          animation: textFadeIn 1.5s ease forwards;
          animation-delay: 5s;
        }
      `}</style>
    </div>
  );
}
