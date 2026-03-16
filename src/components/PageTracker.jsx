import { useEffect, useRef } from "react";
import { ApiSocket} from "@/utils/ApiSocket";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";

export default function PageTracker({ page }) {

  const hasTracked = useRef(false);
  const { user } = useAuth();

  const userId = user?.user_id || null;
//   console.log(ApiSocket);]
// console.log(page)

  useEffect(() => {

    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackPage = async () => {
      try {
        await ApiSocket.post("/comrade/send_page_messenger", {
        page_name: page,
        user: userId
        });
      } catch (err) {
        Sentry.captureException(err);
        console.error(err)
      }
    };

    trackPage();

  }, [page, userId]);

  return null;
}