import { useState, useEffect } from "react";
import Flashcard from "../components/Flashcard";

function FlashcardsPage({ result }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "single"
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [flipped, setFlipped] = useState([]);

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
        // Initialize flipped state for each card
        setFlipped(new Array(parsed.length).fill(false));
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

  // Function to shuffle cards
  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!result || flashcards.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-purple-50 rounded-full p-6 mb-6">
          <svg className="w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">No Flashcards Available</h2>
        <p className="text-lg text-gray-600 mb-6 text-center">Upload a document and generate flashcards to study with.</p>
        <a 
          href="/dashboard"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Generate Flashcards
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
          🃏 Flashcards
        </h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 flex items-center ${viewMode === "grid" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-purple-50"}`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode("single")}
              className={`px-4 py-2 flex items-center ${viewMode === "single" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-purple-50"}`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Study
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          {filteredCards.length} cards available
        </div>
        
        {viewMode === "single" && (
          <button
            onClick={shuffleCards}
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
        )}
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card, index) => (
            <div key={index} className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
              <Flashcard 
                term={card.term} 
                definition={card.definition} 
                index={index}
                customClasses={{
                  container: "rounded-xl overflow-hidden border border-purple-100",
                  header: "bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4",
                  content: "p-5 bg-white",
                  term: "mb-4 pb-3 border-b border-purple-100",
                  termTitle: "font-bold text-sm text-purple-900 mb-1",
                  termText: "text-gray-800",
                  definitionTitle: "font-bold text-sm text-purple-700 mb-1",
                  definitionText: "text-gray-800"
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {filteredCards.length > 0 && (
            <>
              <div className="w-full max-w-2xl mb-6">
                <Flashcard 
                  term={filteredCards[currentIndex].term} 
                  definition={filteredCards[currentIndex].definition} 
                  index={currentIndex}
                  customClasses={{
                    container: "rounded-xl overflow-hidden border border-purple-100 shadow-lg",
                    header: "bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5",
                    content: "p-8 bg-white min-h-[300px] flex flex-col justify-center",
                    term: "mb-8 pb-4 border-b border-purple-100 text-center",
                    termTitle: "font-bold text-lg text-purple-900 mb-2",
                    termText: "text-xl text-gray-800",
                    definitionTitle: "font-bold text-lg text-purple-700 mb-2 text-center",
                    definitionText: "text-lg text-gray-800 text-center"
                  }}
                />
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-8">
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-purple-50 transition-colors text-purple-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <span className="text-purple-900 font-medium">
                    {currentIndex + 1} / {filteredCards.length}
                  </span>
                </div>
                <button 
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-purple-50 transition-colors text-purple-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Study tips section */}
              <div className="mt-10 p-6 bg-purple-50 rounded-xl border border-purple-100 w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Study Tips
                </h3>
                <ul className="mt-4 space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Try to recall the definition before flipping the card</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Shuffle the cards frequently to improve recall</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Study in short sessions for better retention</span>
                  </li>
                </ul>
                
                <div className="mt-6 pt-4 border-t border-purple-100 flex justify-center">
                  <button
                    onClick={() => window.location.href='/dashboard/quiz'}
                    className="inline-flex items-center px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Take a Quiz on this material
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FlashcardsPage;