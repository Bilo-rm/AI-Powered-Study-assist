// src/components/Quiz.jsx
import React from "react";
import { motion } from "framer-motion";
import { useDashboard } from "./DashboardContext";

export default function Quiz() {
  const { setActiveScreen } = useDashboard();

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full h-full justify-center items-center text-white"
    >
      <h2 className="text-2xl font-bold mb-4">Quiz Generator</h2>
      <div className="bg-[#0F0B0B] w-3/4 p-4 rounded-lg shadow-lg mb-4">
        {/* Placeholder for quiz content */}
        <p className="text-gray-300">
          Your AI-generated quiz will appear here.
        </p>
      </div>
      <button
        onClick={() => setActiveScreen("HOME")}
        className="mt-4 bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
      >
        Back to Dashboard
      </button>
    </motion.div>
  );
}
