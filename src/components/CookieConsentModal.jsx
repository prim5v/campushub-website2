import React, { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookieConsentModal() {
  const {
    consentChoice,        // "all" | "essential" | null
    giveAllConsent,
    giveEssentialConsent,
    dismissTemporarily
  } = useCookieConsent();

  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const [visible, setVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  // ---------- Slide In On Mount ----------
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // ---------- Drag Logic ----------
  const onTouchStart = (e) => {
    setDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (!dragging) return;
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0) setDragOffset(delta);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (dragOffset > 120) dismissTemporarily();
    setDragOffset(0);
  };

  // ---------- Mouse Drag ----------
  const onMouseDown = (e) => {
    setDragging(true);
    startY.current = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    currentY.current = e.clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0) setDragOffset(delta);
  };

  const onMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragOffset > 120) dismissTemporarily();
    setDragOffset(0);
  };

  // Attach mouse listeners safely
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, dragOffset]);

  // ---------- Render Control (SAFE) ----------
  const shouldShow = consentChoice === null;

  if (!shouldShow) return null;

  // ---------- Render ----------
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
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              We value your privacy
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Essential cookies keep the platform secure and functional.
              Analytics cookies help us improve features and performance.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full md:w-auto justify-between md:justify-end gap-3">

            <button
              onClick={giveEssentialConsent}
              className="
                flex-1 md:flex-none
                px-5 py-2.5 rounded-xl
                border border-slate-300 dark:border-slate-700
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition
              "
            >
              Essential Only
            </button>

            <button
              onClick={giveAllConsent}
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
              Accept All
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
