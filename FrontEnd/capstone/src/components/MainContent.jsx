// src/components/MainContent.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "./DashboardContext";
import Chatbot from "./Chatbot";
import Quiz from "./Quiz";
import Flashcards from "./Flashcards";

export default function MainContent() {
  const { activeScreen, setActiveScreen } = useDashboard();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // If not on HOME, we show the selected screen
  if (activeScreen !== "HOME") {
    return (
      <AnimatePresence mode="wait">
        {activeScreen === "CHATBOT" && <Chatbot />}
        {activeScreen === "QUIZ" && <Quiz />}
        {activeScreen === "FLASHCARD" && <Flashcards />}
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center w-full h-screen bg-[#36454F] text-white"
    >
      <div className="bg-[#0F0B0B] p-6 rounded-lg w-3/4 text-center shadow-lg">
        <h2 className="text-xl font-semibold">How can I help you today?</h2>
        
        {/* 4 Cards */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Card
            title="Concept Explanation"
            onClick={() => setActiveScreen("CHATBOT")}
          />
          <Card
            title="Summarization"
            onClick={() => setActiveScreen("CHATBOT")}
          />
          <Card
            title="Quiz Generation"
            onClick={() => setActiveScreen("QUIZ")}
          />
          <Card
            title="Flash Card Creator"
            onClick={() => setActiveScreen("FLASHCARD")}
          />
        </div>

        {/* File Upload + Message */}
        <div className="flex items-center justify-center mt-6">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-1/2 p-2 ml-2 rounded bg-gray-700 text-white"
          />
          <button
            className="bg-[#53C844] p-2 ml-2 rounded hover:bg-green-500 transition"
            onClick={() => {
              console.log("File:", file);
              console.log("Message:", message);
              // You can decide how to handle file + message
              setActiveScreen("CHATBOT");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Reusable Card Component
function Card({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0F0B0B] border border-gray-700 w-40 h-32 flex items-center justify-center rounded-lg cursor-pointer hover:border-[#53C844] transition"
    >
      <span className="text-white text-center">{title}</span>
    </div>
  );
}
