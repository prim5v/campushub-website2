import React from "react";
import { Link } from "wouter"

export default function MarketplaceNudgeModal({
  open,
  visible,
  dragOffset,
  dragging,
  sheetRef,
  onClose,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown
}) {
  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{
          transform: `translateY(${visible ? dragOffset : 120 + dragOffset}px)`,
          transition: dragging ? "none" : "transform 300ms ease"
        }}
        className="
          pointer-events-auto
          w-full max-w-5xl
          mx-4 mb-4
          rounded-2xl
          border border-slate-200 dark:border-slate-800
          bg-white/95 dark:bg-slate-900/95
          shadow-2xl
          backdrop-blur-sm
          p-5
          select-none
        "
      >
        {/* Handle */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Text */}
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Join the Campus Marketplace!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Are you a student on campus? Buy, sell, or swap items with your fellow students quickly and safely.  
              Discover great deals and share what you no longer need. Start connecting today!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full md:w-auto justify-between md:justify-end gap-3">
            <button
              onClick={onClose}
              className="
                flex-1 md:flex-none
                px-5 py-2.5 rounded-xl
                border border-slate-300 dark:border-slate-700
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition
              "
            >
              Maybe Later
            </button>

           <Link href="/marketplace">
            <button
              onClick={onClose}
              className="
                flex-1 md:flex-none
                px-5 py-2.5 rounded-xl
                font-medium
                bg-blue-600 hover:bg-blue-700
                text-white
                transition
                shadow-lg shadow-blue-600/20
              "
            >
              Explore Marketplace
            </button>
           </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
