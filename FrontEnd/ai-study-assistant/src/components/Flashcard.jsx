import { useState } from "react";

function Flashcard({ term, definition, index }) {
  const [flipped, setFlipped] = useState(false);
  
  // Generate a unique gradient for each card based on its index
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-green-500 to-teal-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
    "from-orange-500 to-red-500"
  ];
  
  const gradient = gradients[index % gradients.length];

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full h-64 cursor-pointer perspective relative"
    >
      <div className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md z-10">
        {index + 1}
      </div>
      
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of Card */}
        <div className="absolute backface-hidden w-full h-full bg-white border-2 border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-lg">
          <div className={`bg-gradient-to-r ${gradient} h-2 w-full`}></div>
          <div className="flex items-center justify-center flex-1 p-6">
            <h3 className="text-3xl font-bold text-gray-800 text-center">{term}</h3>
          </div>
          <div className="bg-gray-50 py-2 px-4 text-center">
            <span className="text-sm text-gray-500">Click to reveal answer</span>
          </div>
        </div>
        
        {/* Back of Card */}
        <div className="absolute backface-hidden w-full h-full rounded-xl flex flex-col overflow-hidden shadow-lg rotate-y-180">
          <div className={`bg-gradient-to-r ${gradient} p-4 flex items-center justify-between`}>
            <h3 className="text-xl font-bold text-white">{term}</h3>
            <div className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 bg-white p-5 overflow-auto">
            <p className="text-lg text-gray-700">{definition}</p>
          </div>
          <div className="bg-gray-50 py-2 px-4 text-center">
            <span className="text-sm text-gray-500">Click to see term</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;