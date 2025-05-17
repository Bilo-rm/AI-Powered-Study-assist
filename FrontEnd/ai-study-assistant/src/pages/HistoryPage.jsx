import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getResponseHistory, deleteResponseHistory } from "../api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rightPanelRef = useRef(null);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // If we're entering fullscreen and browser supports it, request fullscreen
    if (!isFullscreen && rightPanelRef.current && rightPanelRef.current.requestFullscreen) {
      rightPanelRef.current.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else if (document.fullscreenElement && document.exitFullscreen) {
      // If we're exiting fullscreen and browser supports it
      document.exitFullscreen().catch(err => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  // Handle browser's fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleDownload = (content, action, filename) => {
    // Create appropriate filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const cleanFilename = filename.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    let downloadFilename = `${action}_${cleanFilename}_${timestamp}`;
    let fileContent = '';
    let fileType = 'text/plain';
    
    try {
      // Format content based on action type
      switch(action) {
        case "summary":
          downloadFilename += '.md';
          fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
          break;
          
        case "flashcards":
          downloadFilename += '.json';
          fileType = 'application/json';
          
          // Try to parse the content if it's a string
          const flashcardsData = typeof content === 'string' ? 
            (content.match(/```json\s*([\s\S]*?)\s*```/) ? 
              JSON.parse(content.match(/```json\s*([\s\S]*?)\s*```/)[1]) : 
              JSON.parse(content)) : 
            content;
            
          // Format as JSON with pretty-printing
          fileContent = JSON.stringify(flashcardsData, null, 2);
          break;
          
        case "quiz":
          downloadFilename += '.json';
          fileType = 'application/json';
          
          // Try to parse the content if it's a string
          const quizData = typeof content === 'string' ? 
            (content.match(/```json\s*([\s\S]*?)\s*```/) ? 
              JSON.parse(content.match(/```json\s*([\s\S]*?)\s*```/)[1]) : 
              JSON.parse(content)) : 
            content;
            
          // Format as JSON with pretty-printing
          fileContent = JSON.stringify(quizData, null, 2);
          break;
          
        default:
          fileContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      }
      
      // Create a blob from the content
      const blob = new Blob([fileContent], { type: fileType });
      
      // Create a download link and trigger click
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success(`Downloaded as ${downloadFilename}`);
    } catch (error) {
      console.error("Error downloading content:", error);
      toast.error("Failed to download content");
    }
  };

  const renderSummaryContent = (response) => {
    try {
      // Try to extract sections from the summary
      const sections = [];
      let currentSection = { title: "Overview", content: [] };
      
      const lines = response.split('\n');
      lines.forEach(line => {
        // Check if line is a heading
        if (line.startsWith('##') || line.startsWith('# ')) {
          // If we already have content in current section, push it to sections
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          // Start a new section
          const title = line.replace(/^#+\s+/, '');
          currentSection = { title, content: [] };
        } else if (line.trim() !== '') {
          // Add line to current section
          currentSection.content.push(line);
        }
      });
      
      // Add the last section
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }

      // If we couldn't extract any sections, create a single section with the whole content
      if (sections.length === 0) {
        sections.push({ title: "Summary", content: response.split('\n') });
      }

      return (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="p-6">
                <div className="prose prose-purple max-w-none">
                  <ReactMarkdown>
                    {section.content.join('\n')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100">
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
                <span>Review this summary regularly to reinforce key concepts</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Create flashcards based on key terms in this summary</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-4 border-t border-purple-100 flex justify-between">
              <button
                onClick={() => window.location.href='/dashboard/flashcards'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Create Flashcards
              </button>
              
              <button
                onClick={() => window.location.href='/dashboard/quiz'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take a Quiz
              </button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering summary:", error);
      // Fallback to simple text display
      return <div className="whitespace-pre-wrap text-gray-700 p-6 bg-white rounded-xl shadow-sm">{response}</div>;
    }
  };

  const renderFlashcardsContent = (response) => {
    try {
      // Parse the JSON data
      let flashcards = [];
      
      // Try different patterns to extract the flashcards
      try {
        // Try direct JSON parsing
        flashcards = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (e) {
        // Try to extract JSON from markdown code blocks if present
        const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          flashcards = JSON.parse(match[1]);
        } else {
          throw new Error("Could not parse flashcards data");
        }
      }
      
      return (
        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {flashcards.map((card, index) => (
              <div key={index} className="rounded-xl transition-all duration-500 bg-white shadow-md hover:shadow-lg">
                <div className="h-full flex flex-col relative overflow-hidden border border-purple-100 rounded-xl">
                  <div className="absolute top-2 right-2 bg-purple-100 text-purple-600 rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-3">
                    <h3 className="font-bold text-md text-white">Flashcard #{index + 1}</h3>
                  </div>
                  
                  <div className="flex-1 flex flex-col p-4">
                    <div className="mb-4 pb-3 border-b border-purple-100">
                      <h4 className="font-bold text-sm text-purple-900 mb-1">Term</h4>
                      <p className="text-gray-800">{card.term}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-sm text-purple-700 mb-1">Definition</h4>
                      <p className="text-gray-800">{card.definition}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Flashcard Study Tips
            </h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Try recalling the definition before looking at it</span>
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
            
            <div className="mt-6 pt-4 border-t border-purple-100 text-center">
              <button
                onClick={() => window.location.href='/dashboard/flashcards'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Study These Flashcards
              </button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering flashcards:", error);
      // Fallback to simple text display
      return <div className="whitespace-pre-wrap text-gray-700 p-6 bg-white rounded-xl shadow-sm">{response}</div>;
    }
  };
  
  const renderQuizContent = (response) => {
    try {
      // Parse the JSON data
      let questions = [];
      
      // Try different patterns to extract the questions
      try {
        // Try direct JSON parsing
        questions = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (e) {
        // Try to extract JSON from markdown code blocks if present
        const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          questions = JSON.parse(match[1]);
        } else {
          throw new Error("Could not parse quiz data");
        }
      }
      
      return (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full h-8 w-8 flex items-center justify-center text-white font-semibold mr-3">
                  {index + 1}
                </div>
                <h2 className="text-lg font-bold text-white">{question.question}</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex} 
                      className={`p-3 rounded-lg border flex items-center ${
                        option === question.answer 
                          ? "bg-green-50 border-green-200" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm ${
                        option === question.answer 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </div>
                      <span className={option === question.answer ? "font-medium" : ""}>{option}</span>
                      
                      {option === question.answer && (
                        <svg className="w-5 h-5 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-50 rounded-xl p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quiz Overview
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="text-sm text-gray-500">Total Questions</div>
                <div className="text-2xl font-bold text-purple-900">{questions.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <div className="text-sm text-gray-500">Difficulty</div>
                <div className="text-lg font-medium text-purple-900">Intermediate</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-purple-100 text-center">
              <button
                onClick={() => window.location.href='/dashboard/quiz'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take This Quiz
              </button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering quiz:", error);
      // Fallback to simple text display
      return <div className="whitespace-pre-wrap text-gray-700 p-6 bg-white rounded-xl shadow-sm">{response}</div>;
    }
  };

  const renderResponseContent = (response, action) => {
    try {
      // Based on action type, render appropriate content
      switch(action) {
        case "summary":
          return renderSummaryContent(response);
        case "flashcards":
          return renderFlashcardsContent(response);
        case "quiz":
          return renderQuizContent(response);
        default:
          return <div className="whitespace-pre-wrap text-gray-700 p-6 bg-white rounded-xl shadow-sm">{response}</div>;
      }
    } catch (error) {
      console.error("Error rendering response:", error);
      return <div className="whitespace-pre-wrap text-gray-700 p-6 bg-white rounded-xl shadow-sm">{response}</div>;
    }
  };

  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(item => item.action === filter);

  // Get icon based on action type
  const getActionIcon = (action) => {
    switch(action) {
      case "summary":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "flashcards":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "quiz":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900">Learning History</h1>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("summary")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "summary" 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            Summaries
          </button>
          <button 
            onClick={() => setFilter("flashcards")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "flashcards" 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            Flashcards
          </button>
          <button 
            onClick={() => setFilter("quiz")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "quiz" 
                ? "bg-purple-600 text-white" 
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
          >
            Quizzes
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${isFullscreen ? '' : 'lg:grid-cols-3'} gap-6`}>
          {/* History List - Left Panel (hidden when fullscreen) */}
          {!isFullscreen && (
            <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-md h-[calc(100vh-200px)] overflow-y-auto">
              {filteredHistory.length > 0 ? (
                <div className="space-y-3">
                  {filteredHistory.map(item => (
                    <div 
                      key={item.id} 
                      className={`border rounded-lg cursor-pointer transition-all ${
                        selectedItem?.id === item.id 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                              selectedItem?.id === item.id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"
                            }`}>
                              {getActionIcon(item.action)}
                            </div>
                            <div>
                              <h3 className={`font-medium text-base ${
                                selectedItem?.id === item.id ? "text-purple-900" : "text-gray-900"
                              }`}>
                                {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                              </h3>
                              <p className="text-sm text-gray-500 truncate max-w-[180px]" title={item.fileName}>
                                {item.fileName}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-purple-50 rounded-full p-6 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-center mb-2">No history items found.</p>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    {filter !== "all" 
                      ? "Try selecting a different filter" 
                      : "Process your first document to see history"
                    }
                  </p>
                  {filter !== "all" && (
                    <button 
                      onClick={() => setFilter("all")}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 border border-purple-200"
                    >
                      View all items
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content Display - Right Panel - Enhanced with better formatting */}
          <div 
            ref={rightPanelRef}
            className={`${isFullscreen ? 'col-span-3' : 'lg:col-span-2'} rounded-xl shadow-md border border-gray-100 p-6 bg-white h-[calc(100vh-200px)] overflow-y-auto relative`}
          >
            {/* Fullscreen button */}
            {selectedItem && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 text-gray-500 hover:text-purple-600 transition-colors p-2 bg-white rounded-lg shadow-sm"
                title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2v-4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4a1 1 0 102 0H9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v2m0 0h2M5 8V6m0 0h2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20a1 1 0 10-2 0h2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20v-2m0 0h-2m4-2v2m0 0h-2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                )}
              </button>
            )}

            {selectedItem ? (
              <div>
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100 rounded-full p-2 mr-3 text-purple-600">
                      {getActionIcon(selectedItem.action)}
                    </div>
                    <h2 className="text-2xl font-bold text-purple-900">
                      {selectedItem.action.charAt(0).toUpperCase() + selectedItem.action.slice(1)}
                    </h2>
                  </div>
                  <p className="text-gray-500 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {selectedItem.fileName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(selectedItem.createdAt)}
                    </span>
                  </p>
                </div>
                
                <div className="response-content">
                  {renderResponseContent(selectedItem.response, selectedItem.action)}
                </div>
                
                {/* Action buttons at the bottom */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between">
                  {!isFullscreen && (
                    <button
                      onClick={() => window.location.href='/dashboard'}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Back to Dashboard
                    </button>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        if (selectedItem) {
                          handleDelete(selectedItem.id);
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    
                    {/* Download button replacing print button */}
                    <button
                      onClick={() => handleDownload(selectedItem.response, selectedItem.action, selectedItem.fileName)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 border border-purple-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    
                    {/* Fullscreen toggle button for mobile or as an alternative */}
                    <button
                      onClick={toggleFullscreen}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 flex items-center lg:hidden"
                    >
                      {isFullscreen ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                          </svg>
                          <span>Exit Fullscreen</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          </svg>
                          <span>Fullscreen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="bg-purple-50 rounded-full p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-purple-900 mb-2">No content selected</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Select an item from the list to view its content. Your generated summaries, flashcards, and quizzes will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;