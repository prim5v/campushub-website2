import { createContext, useContext, useState, useEffect } from "react";

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {

  // ---------- Load Initial State ----------
  const [consentChoice, setConsentChoice] = useState(() => {
    const stored = localStorage.getItem("cookie_consent");

    // Migration support (old boolean system)
    if (stored === "true") return "all";
    if (stored === "false") return "essential";

    return stored; // "all" | "essential" | null
  });

  // ---------- Actions ----------
  const giveAllConsent = () => {
    localStorage.setItem("cookie_consent", "all");
    setConsentChoice("all");
  };

  const giveEssentialConsent = () => {
    localStorage.setItem("cookie_consent", "essential");
    setConsentChoice("essential");
  };

  // Temporary close (does NOT save choice)
  const dismissTemporarily = () => {
    setConsentChoice(null);
  };

  // Reset helper (useful for testing / settings page later)
  const resetConsent = () => {
    localStorage.removeItem("cookie_consent");
    setConsentChoice(null);
  };

  // ---------- Derived Values ----------
  const consentGiven = consentChoice !== null;
  const analyticsAllowed = consentChoice === "all";

  return (
    <CookieConsentContext.Provider
      value={{
        consentChoice,        // "all" | "essential" | null
        consentGiven,         // boolean
        analyticsAllowed,     // boolean

        giveAllConsent,
        giveEssentialConsent,
        dismissTemporarily,
        resetConsent
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
};
