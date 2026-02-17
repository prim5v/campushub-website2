import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthNudgeModal from "./AuthNudgeModal";

const ONE_HOUR = 60 * 60 * 1000;
const FIVE_SECONDS = 5000;

export default function AuthNudgeController() {
  const { authStatus } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authStatus !== "idle") return;

    let mountTimer;
    let intervalTimer;

    mountTimer = setTimeout(() => {
      setOpen(true);
    }, FIVE_SECONDS);

    intervalTimer = setInterval(() => {
      setOpen(true);
    }, ONE_HOUR);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(intervalTimer);
    };
  }, [authStatus]);

  // Close modal if user becomes authenticated / flow changes
  useEffect(() => {
    if (authStatus !== "idle") setOpen(false);
  }, [authStatus]);

  return (
    <AuthNudgeModal
      open={open}
      onClose={() => setOpen(false)}
      onSignupIntent={() => setOpen(false)}   // ✅ NEW
    />
  );
}
