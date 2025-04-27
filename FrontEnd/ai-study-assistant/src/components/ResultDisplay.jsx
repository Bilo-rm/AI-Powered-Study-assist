import { useState } from "react";

function Flashcard({ term, definition }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-72 h-48 cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute backface-hidden w-full h-full bg-white border border-gray-300 rounded-xl flex items-center justify-center text-2xl font-semibold p-4 shadow-lg hover:shadow-xl transition-all duration-200">
          <p className="text-center text-gray-800">{term}</p>
        </div>
        <div className="absolute backface-hidden w-full h-full bg-blue-600 text-white border border-gray-300 rounded-xl flex items-center justify-center text-lg p-4 shadow-lg rotate-y-180 hover:shadow-xl transition-all duration-200">
          <p className="text-center">{definition}</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
