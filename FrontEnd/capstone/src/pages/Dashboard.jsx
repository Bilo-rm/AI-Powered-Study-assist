// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import { DashboardProvider } from "../components/DashboardContext";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <MainContent />
        </div>
      </div>
    </DashboardProvider>
  );
}
