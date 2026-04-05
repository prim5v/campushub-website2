// // main.jsx
// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { LandlordProvider } from "@/contexts/LandlordContext";
// import { CookieConsentProvider } from "@/contexts/CookieConsentContext"; // ✅ import

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <CookieConsentProvider> {/* ✅ wrap everything in CookieConsentProvider */}
//       <AuthProvider>
//         <LandlordProvider>
//           <App />
//         </LandlordProvider>
//       </AuthProvider>
//     </CookieConsentProvider>
//   </React.StrictMode>
// );

// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LandlordProvider } from "@/contexts/LandlordContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import * as Sentry from "@sentry/react";
import { DashboardProvider } from "./contexts/DashboardContext";
import LocationProvider from "@/contexts/LocationContext";

// Initialize Sentry (error reporting only, no tracing for now)
Sentry.init({
  dsn: "https://df6883549ffcef996a3efa124d556367@o4510996521418752.ingest.us.sentry.io/4510996523450368",
  tracesSampleRate: 0, // Set to 0 since we are skipping performance tracing
  environment: process.env.NODE_ENV,
  sendDefaultPii: true, // optional, captures PII like IP
  integrations: [
    Sentry.replayIntegration()
  ],
  // session Replay
  replaysSessionSampleRate: 1.0, // Record 10% of sessions for replay change to 0.1 in production and 1.0 for testing
  replaysOnErrorSampleRate: 1.0, // Record all sessions that encounter an error

});

// Create root
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CookieConsentProvider>
      <AuthProvider>
        <DashboardProvider>
        <LandlordProvider>
          <LocationProvider>
          <Sentry.ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
            <App />
          </Sentry.ErrorBoundary>
        </LocationProvider>
        </LandlordProvider>
        </DashboardProvider>
      </AuthProvider>
    </CookieConsentProvider>
  </React.StrictMode>
);