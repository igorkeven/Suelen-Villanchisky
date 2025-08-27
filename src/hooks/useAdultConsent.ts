"use client";
import { useEffect, useState } from "react";

export function useAdultConsent() {
  const [consented, setConsented] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adultConsent");
      setConsented(stored === "true");
    }
  }, []);
  
  const accept = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adultConsent", "true");
      setConsented(true);
    }
  };
  
  const reset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adultConsent");
      setConsented(false);
    }
  };
  
  return { consented, accept, reset };
}