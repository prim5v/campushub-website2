import { useEffect, useState } from "react";
import RoomRequestModal from "./RoomRequestModal";
import { useAuth } from "@/contexts/AuthContext";

const TEN_SECONDS = 10000;
const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function RoomRequestController() {

  const [open, setOpen] = useState(false);
  const { authStatus } = useAuth();

  useEffect(() => {

    // Only run when user is authenticated
    if (authStatus !== "authenticated") return;

    let mountTimer;
    let intervalTimer;

    mountTimer = setTimeout(() => {
      setOpen(true);
    }, TEN_SECONDS);

    intervalTimer = setInterval(() => {
      setOpen(true);
    }, TWO_HOURS);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(intervalTimer);
    };

  }, [authStatus]);

  return (
    <RoomRequestModal
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}