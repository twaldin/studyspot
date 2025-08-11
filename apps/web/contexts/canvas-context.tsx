"use client";

import * as React from "react";

interface CanvasContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const CanvasContext = React.createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  return (
    <CanvasContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = React.useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}
