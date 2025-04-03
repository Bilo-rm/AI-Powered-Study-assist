import React from "react";

const ChatMessage = ({ message, sender }) => {
  return (
    <div className={`p-3 my-2 rounded ${sender === "bot" ? "bg-gray-700" : "bg-blue-500"} text-white`}>
      {message}
    </div>
  );
};

export default ChatMessage;
