"use client";

import * as React from "react";
import { useUserSchool } from "@/hooks/api/user";

interface CanvasContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isCanvasEnabled: boolean;
}

const CanvasContext = React.createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const { data: userSchool } = useUserSchool();
  
  // Check if Canvas is enabled for this school (treat null as false)
  const isCanvasEnabled = userSchool?.canvas_integration === true;

  // Wrapper for setAccessToken that only sets if Canvas is enabled
  const safeSetAccessToken = React.useCallback((token: string | null) => {
    if (isCanvasEnabled) {
      setAccessToken(token);
    }
  }, [isCanvasEnabled]);

  // Clear token if Canvas is disabled
  React.useEffect(() => {
    if (!isCanvasEnabled && accessToken) {
      setAccessToken(null);
    }
  }, [isCanvasEnabled, accessToken]);

  return (
    <CanvasContext.Provider value={{ 
      accessToken: isCanvasEnabled ? accessToken : null, 
      setAccessToken: safeSetAccessToken,
      isCanvasEnabled 
    }}>
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
