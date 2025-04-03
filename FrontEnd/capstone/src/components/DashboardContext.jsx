// src/components/DashboardContext.jsx
import { createContext, useState, useContext } from "react";

// Create context
const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  // Possible values: "HOME", "CHATBOT", "QUIZ", "FLASHCARD"
  const [activeScreen, setActiveScreen] = useState("HOME");

  return (
    <DashboardContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook for easier usage
export function useDashboard() {
  return useContext(DashboardContext);
}
