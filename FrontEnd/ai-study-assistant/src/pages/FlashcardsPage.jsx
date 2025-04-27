import { useState, useEffect } from "react";
import Flashcard from "../components/Flashcard";

function FlashcardsPage({ result }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "single"
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    if (!result) {
      setIsLoading(false);
      return;
    }

    try {
      // Log the result for debugging purposes
      console.log("Raw result:", result);
      
      // Use regex to extract the JSON string from the backticks
      const match = result.match(/```json\s*([\s\S]*?)\s*```/);
      
      if (match && match[1]) {
        // Parse the JSON inside the backticks
        const parsed = JSON.parse(match[1]);
        setFlashcards(parsed);
        setFilteredCards(parsed);
        console.log("Parsed flashcards:", parsed);
      } else {
        console.error("Failed to extract JSON from result string:", result);
      }
    } catch (error) {
      console.error("Failed to parse flashcards JSON", error);
    } finally {
      setIsLoading(false);
    }
  }, [result]);

  useEffect(() => {
    // Filter cards based on search term
    if (searchTerm.trim() === "") {
      setFilteredCards(flashcards);
    } else {
      const filtered = flashcards.filter(
        card => 
          card.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
          card.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(filtered);
    }
  }, [searchTerm, flashcards]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex < filteredCards.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : filteredCards.length - 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result || flashcards.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <svg className="w-20 h-20 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-xl text-gray-600 mb-6 text-center">No flashcards available.</p>
        <a 
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Flashcards
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
          🃏 Flashcards
        </h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 flex items-center ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode("single")}
              className={`px-4 py-2 flex items-center ${viewMode === "single" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Study
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-2 text-gray-600">
        {filteredCards.length} cards available
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {filteredCards.map((card, index) => (
            <div key={index} className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
              <Flashcard term={card.term} definition={card.definition} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {filteredCards.length > 0 && (
            <>
              <div className="w-full max-w-xl mb-6">
                <Flashcard 
                  term={filteredCards[currentIndex].term} 
                  definition={filteredCards[currentIndex].definition} 
                  index={currentIndex}
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button 
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-gray-600 font-medium">
                  {currentIndex + 1} / {filteredCards.length}
                </span>
                <button 
                  onClick={handleNext}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FlashcardsPage;