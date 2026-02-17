import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MarketplaceNudgeModal from "./MarketplaceNudgeModal";

const TEN_SECONDS = 10000;
const ONE_HOUR = 60 * 60 * 1000;

export default function MarketplaceNudgeController() {
  const { authStatus } = useAuth();
  const [open, setOpen] = useState(false);

  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);

  // Slide-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Show modal 10s after mount, repeat every 1h
  useEffect(() => {
    if (authStatus !== "authenticated" && authStatus !== "unauthenticated") return;

    const mountTimer = setTimeout(() => setOpen(true), TEN_SECONDS);
    const intervalTimer = setInterval(() => setOpen(true), ONE_HOUR);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(intervalTimer);
    };
  }, [authStatus]);

  // Drag handlers
  const onTouchStart = (e) => { setDragging(true); startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (!dragging) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setDragOffset(delta);
  };
  const onTouchEnd = () => {
    setDragging(false);
    if (dragOffset > 120) setOpen(false);
    setDragOffset(0);
  };

  const onMouseDown = (e) => { setDragging(true); startY.current = e.clientY; };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const delta = e.clientY - startY.current;
    if (delta > 0) setDragOffset(delta);
  };
  const onMouseUp = () => {
    setDragging(false);
    if (dragOffset > 120) setOpen(false);
    setDragOffset(0);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <MarketplaceNudgeModal
      open={open}
      visible={visible}
      dragOffset={dragOffset}
      dragging={dragging}
      sheetRef={sheetRef}
      onClose={() => setOpen(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    />
  );
}
