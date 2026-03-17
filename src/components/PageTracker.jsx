import { useEffect, useRef } from "react";
import { ApiSocket } from "@/utils/ApiSocket";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";

export default function PageTracker({ page }) {

  const { user } = useAuth();
  const userId = user?.user_id || null;

  const lastSent = useRef(0);

  const trackPage = async () => {
    try {

      const now = Date.now();

      // throttle → only send every 5 seconds
      if (now - lastSent.current < 5000) return;

      lastSent.current = now;

      await ApiSocket.post("/comrade/send_page_messenger", {
        page_name: page,
        user: userId
      });

    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  useEffect(() => {

    const handleActivity = () => {
      trackPage();
    };

    // track activity events
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // send once when page loads
    trackPage();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };

  }, [page, userId]);

  return null;
}
// import { useEffect, useRef } from "react";
// import { ApiSocket} from "@/utils/ApiSocket";
// import * as Sentry from "@sentry/react";
// import { useAuth } from "@/contexts/AuthContext";

// export default function PageTracker({ page }) {

//   const hasTracked = useRef(false);
//   const { user } = useAuth();

//   const userId = user?.user_id || null;
// //   console.log(ApiSocket);]
// // console.log(page)

//   useEffect(() => {

//     if (hasTracked.current) return;
//     hasTracked.current = true;

//     const trackPage = async () => {
//       try {
//         await ApiSocket.post("/comrade/send_page_messenger", {
//         page_name: page,
//         user: userId
//         });
//       } catch (err) {
//         Sentry.captureException(err);
//         console.error(err)
//       }
//     };

//     trackPage();

//   }, [page, userId]);

//   return null;
// }