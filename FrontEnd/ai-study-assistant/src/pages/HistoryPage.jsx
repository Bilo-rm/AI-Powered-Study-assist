import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getResponseHistory, deleteResponseHistory } from "../api";
import { toast } from "sonner";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getResponseHistory();
      if (response.data && response.data.data) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResponseHistory(id);
      // Update history after successful deletion
      setHistory(history.filter(item => item.id !== id));
      toast.success("Item deleted successfully");
      
      // If the deleted item was selected, clear the selection
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("Failed to delete item");
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderResponseContent = (response, action) => {
    try {
      if (action === "summary") {
        // Summary is usually plain text
        return <div className="whitespace-pre-wrap">{response}</div>;
      } else if (action === "flashcards" || action === "quiz") {
        // Try to parse JSON for flashcards or quiz
        const parsedData = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (action === "flashcards") {
          return (
            <div className="space-y-4">
              {parsedData.map((card, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow">
                  <h3 className="font-bold text-lg mb-2">Term: {card.term}</h3>
                  <p className="text-gray-700">Definition: {card.definition}</p>
                </div>
              ))}
            </div>
          );
        } else {
          // Quiz display
          return (
            <div className="space-y-6">
              {parsedData.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow">
                  <h3 className="font-bold text-lg mb-2">Question {index + 1}: {question.question}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex} className={option === question.answer ? "font-medium text-green-600" : ""}>
                        {option} {option === question.answer && "(Correct)"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        }
      }
      
      // Fallback for any other format
      return <div className="whitespace-pre-wrap">{response}</div>;
    } catch (error) {
      console.error("Error rendering response:", error);
      return <div className="whitespace-pre-wrap">{response}</div>;
    }
  };

  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(item => item.action === filter);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your History</h1>
        <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("summary")}
            className={`px-4 py-2 rounded ${filter === "summary" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Summaries
          </button>
          <button 
            onClick={() => setFilter("flashcards")}
            className={`px-4 py-2 rounded ${filter === "flashcards" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Flashcards
          </button>
          <button 
            onClick={() => setFilter("quiz")}
            className={`px-4 py-2 rounded ${filter === "quiz" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Quizzes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List - Left Panel */}
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg border h-[calc(100vh-200px)] overflow-y-auto">
            {filteredHistory.length > 0 ? (
              <div className="space-y-3">
                {filteredHistory.map(item => (
                  <div 
                    key={item.id} 
                    className={`border p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedItem?.id === item.id ? "border-blue-500 bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-500 truncate" title={item.fileName}>
                          {item.fileName}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p>No history items found.</p>
                {filter !== "all" && (
                  <button 
                    onClick={() => setFilter("all")}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    View all items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content Display - Right Panel */}
          <div className="lg:col-span-2 rounded-lg border p-6 bg-white h-[calc(100vh-200px)] overflow-y-auto">
            {selectedItem ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedItem.action.charAt(0).toUpperCase() + selectedItem.action.slice(1)}
                  </h2>
                  <p className="text-gray-500">
                    <span>{selectedItem.fileName}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(selectedItem.createdAt)}</span>
                  </p>
                </div>
                
                <div className="response-content">
                  {renderResponseContent(selectedItem.response, selectedItem.action)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <p>Select an item from the list to view its content.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;