// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar() {
  return (
    <div className="bg-[#0F0B0B] text-white w-64 h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">My Chat</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded bg-gray-700 text-white mb-4"
      />

      <div className="mb-6">
        <h3 className="text-sm font-semibold">FlashCards</h3>
        {/* Example flashcards placeholder */}
        <div className="bg-gray-700 p-2 mt-2 rounded">Card 1</div>
        <div className="bg-gray-700 p-2 mt-2 rounded">Card 2</div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold">Chat History</h3>
        {/* Example chat history placeholder */}
        <div className="bg-gray-700 p-2 mt-2 rounded">Chat 1</div>
        <div className="bg-gray-700 p-2 mt-2 rounded">Chat 2</div>
      </div>

      <button className="bg-[#53C844] p-2 w-full rounded mt-4 hover:bg-green-500 transition">
        New Chat
      </button>
    </div>
  );
}
