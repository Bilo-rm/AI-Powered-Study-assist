import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ActionSelector from "../components/ActionSelector";
import SummaryPage from "./SummaryPage";
import FlashcardsPage from "./FlashcardsPage";
import QuizPage from "./QuizPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import { uploadFile } from "../api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

function UserDashboard() {
  const [file, setFile] = useState(null);
  const [selectedAction, setSelectedAction] = useState("summary");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a file");
    
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to use this feature");
      navigate("/");
      return;
    }
    
    const toastId = toast.loading("Processing...");
    setIsLoading(true);
    
    try {
      const { data } = await uploadFile(file, selectedAction);
      setResult(data);
      
      toast.dismiss(toastId);
      toast.success("Done!");
      
      // Navigate based on selected action - using absolute paths
      if (selectedAction === "summary") {
        navigate("/dashboard/summary");
      } else if (selectedAction === "flashcards") {
        navigate("/dashboard/flashcards");
      } else if (selectedAction === "quiz") {
        navigate("/dashboard/quiz");
      }
    } catch (error) {
      console.error(error);
    
      toast.dismiss(toastId);
      
      // Show more specific error message if available
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        toast.error("Authentication error. Please log in again.");
        logout(); // Force logout if authentication fails
        navigate("/");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Fixed Sidebar - Always visible on larger screens, toggle on mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ width: "240px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-gray-100">
            <span className="text-purple-700 text-2xl mr-2">📚</span>
            <span className="font-bold text-lg text-purple-800">Study Assistant</span>
          </div>
          
          <nav className="flex-grow p-4 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/summary"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Summaries
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/flashcards"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Flashcards
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/quiz"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/history"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </Link>
              </li>
              {/* Added Profile Link */}

            </ul>
          </nav>
          
          {/* User profile section at the bottom of sidebar - Now clickable to go to profile page */}
          <div className="p-4 border-t border-gray-100">
            <Link to="/dashboard/profile" className="block">
              <div className="flex items-center mb-4 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-2">
                  <div className="font-medium text-sm text-gray-900 truncate max-w-[140px]">
                    {user?.name || user?.email}
                  </div>
                  <div className="text-xs text-gray-500">User Profile</div>
                </div>
              </div>
            </Link>
            <button 
              onClick={logout} 
              className="w-full flex items-center justify-center px-4 py-2 rounded text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted with margin to account for fixed sidebar */}
      <div className="flex-1 lg:ml-60 min-w-0 overflow-hidden">
        {/* Top header with mobile sidebar toggle */}
        <div className="bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="block lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-purple-900">AI Study Assistant</h1>
            <div className="flex items-center">
              <Link to="/dashboard/profile" className="text-sm text-gray-500 mr-4 hidden md:inline-block hover:text-purple-700">
                Welcome back, {user?.name || user?.email}
              </Link>
            </div>
          </div>
        </div>

        {/* Main content area with scrolling */}
        <div className="p-6 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-purple-900 mb-4">Create New Learning Material</h2>
                    <div className="space-y-6">
                      <div>
                        <FileUpload onFileChange={setFile} />
                      </div>
                      <div>
                        <ActionSelector
                          selectedAction={selectedAction}
                          setSelectedAction={setSelectedAction}
                        />
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={!file || isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          file && !isLoading
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          "Generate"
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Tips Section */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-purple-900 mb-4">Quick Tips</h2>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                          <p className="text-sm text-gray-500">Perfect for condensing lengthy materials into concise key points.</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Flashcards</h3>
                          <p className="text-sm text-gray-500">Ideal for memorization and quick reviews of important concepts.</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Quiz</h3>
                          <p className="text-sm text-gray-500">Great for testing your knowledge and reinforcing learning.</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Need help? Check out our <span className="text-purple-600 hover:text-purple-800 cursor-pointer">Guide</span> or <span className="text-purple-600 hover:text-purple-800 cursor-pointer">Contact Support</span>.</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="summary"
              element={<SummaryPage result={result?.data} />}
            />
            <Route
              path="flashcards"
              element={<FlashcardsPage result={result?.data} />}
            />
            <Route
              path="quiz"
              element={<QuizPage result={result?.data} />}
            />
            <Route
              path="history"
              element={<HistoryPage />}
            />
            {/* Added Profile Route */}
            <Route
              path="profile"
              element={<ProfilePage />}
            />
          </Routes>
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default UserDashboard;