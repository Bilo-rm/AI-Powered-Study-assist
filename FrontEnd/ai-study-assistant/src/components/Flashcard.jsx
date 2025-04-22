import { useState } from "react";

function Flashcard({ term, definition }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-72 h-48 cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute backface-hidden w-full h-full bg-white border rounded-lg flex items-center justify-center text-2xl font-bold p-4 shadow-md">
          {term}
        </div>
        <div className="absolute backface-hidden w-full h-full bg-blue-600 text-white border rounded-lg flex items-center justify-center text-lg p-4 shadow-md rotate-y-180">
          {definition}
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
