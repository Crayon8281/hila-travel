import React, { createContext, useContext } from "react";
import { useAssets } from "@/hooks/useAssets";

type AssetContextType = ReturnType<typeof useAssets>;

const AssetContext = createContext<AssetContextType | null>(null);

export function AssetProvider({ children }: { children: React.ReactNode }) {
  const assets = useAssets();
  return (
    <AssetContext.Provider value={assets}>{children}</AssetContext.Provider>
  );
}

export function useAssetContext() {
  const ctx = useContext(AssetContext);
  if (!ctx) {
    throw new Error("useAssetContext must be used within AssetProvider");
  }
  return ctx;
}
