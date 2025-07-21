"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface DeveloperModeContextType {
  isDeveloperModeEnabled: boolean
  toggleDeveloperMode: () => void
}

const DeveloperModeContext = createContext<DeveloperModeContextType | undefined>(undefined)

interface DeveloperModeProviderProps {
  children: React.ReactNode
}

export function DeveloperModeProvider({ children }: DeveloperModeProviderProps) {
  const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] = useState(false)

  // Load developer mode state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("developerMode")
    if (stored) {
      setIsDeveloperModeEnabled(stored === "true")
    }
  }, [])

  const toggleDeveloperMode = () => {
    setIsDeveloperModeEnabled(prev => {
      const newValue = !prev
      localStorage.setItem("developerMode", newValue.toString())
      return newValue
    })
  }

  return (
    <DeveloperModeContext.Provider value={{
      isDeveloperModeEnabled,
      toggleDeveloperMode
    }}>
      {children}
    </DeveloperModeContext.Provider>
  )
}

export function useDeveloperMode() {
  const context = useContext(DeveloperModeContext)
  if (context === undefined) {
    throw new Error("useDeveloperMode must be used within a DeveloperModeProvider")
  }
  return context
}