import React, { createContext, useContext } from "react";
import { useTrips } from "@/hooks/useTrips";

type TripContextType = ReturnType<typeof useTrips>;

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const trips = useTrips();
  return (
    <TripContext.Provider value={trips}>{children}</TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTripContext must be used within TripProvider");
  }
  return ctx;
}
