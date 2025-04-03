// src/components/Chatbot.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDashboard } from "./DashboardContext";

export default function Chatbot() {
  const { setActiveScreen } = useDashboard();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (!userInput.trim()) return;
    setMessages([...messages, { sender: "user", text: userInput }]);
    setUserInput("");
    // Mock response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a mock AI response." },
      ]);
    }, 1000);
  };

  return (
    <motion.div
      key="chatbot"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full h-full justify-center items-center text-white"
    >
      <h2 className="text-2xl font-bold mb-4">Chatbot Interface</h2>
      <div className="bg-[#0F0B0B] w-3/4 p-4 rounded-lg shadow-lg mb-4 max-h-64 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === "user" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex w-3/4">
        <input
          className="flex-grow p-2 rounded-l bg-gray-700 text-white"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-[#53C844] px-4 py-2 rounded-r hover:bg-green-500 transition"
        >
          Send
        </button>
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
