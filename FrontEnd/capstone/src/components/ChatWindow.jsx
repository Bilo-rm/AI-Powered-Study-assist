import React from "react";
import UploadBox from "./UploadBox";

const ChatWindow = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg w-2/3 text-center">
        <h2 className="text-xl font-semibold">How can I help you today?</h2>
        <div className="flex justify-center gap-4 mt-4">
          <button className="bg-gray-700 px-4 py-2 rounded">Concept Explanation</button>
          <button className="bg-gray-700 px-4 py-2 rounded">Summarization</button>
          <button className="bg-gray-700 px-4 py-2 rounded">Quiz Generation</button>
          <button className="bg-gray-700 px-4 py-2 rounded">Flash Card Creator</button>
        </div>
        <UploadBox />
      </div>
    </div>
  );
};

export default ChatWindow;
