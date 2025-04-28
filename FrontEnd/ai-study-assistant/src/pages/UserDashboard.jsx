import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ActionSelector from "../components/ActionSelector";
import SummaryPage from "./SummaryPage";
import FlashcardsPage from "./FlashcardsPage";
import QuizPage from "./QuizPage";
import { uploadFile } from "../api";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

function UserDashboard() {
  const [file, setFile] = useState(null);
  const [selectedAction, setSelectedAction] = useState("summary");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a file");
    
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
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 AI Study Assistant</h1>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-blue-600">Home</Link>
          <Link to="/dashboard/summary" className="text-blue-600">Summary</Link>
          <Link to="/dashboard/flashcards" className="text-blue-600">Flashcards</Link>
          <Link to="/dashboard/quiz" className="text-blue-600">Quiz</Link>
          <div className="flex items-center ml-4 border-l pl-4">
            <span className="text-gray-600 mr-2">{user?.name || user?.email}</span>
            <button onClick={logout} className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FileUpload onFileChange={setFile} />
              <ActionSelector
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
              />
              <button
                onClick={handleSubmit}
                disabled={!file || isLoading}
                className={`mt-4 w-full py-2 rounded ${
                  file && !isLoading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Processing..." : "Generate"}
              </button>
            </>
          }
        />
        <Route
          path="summary"
          element={<SummaryPage result={result?.data?.result} />}
        />
        <Route
          path="flashcards"
          element={<FlashcardsPage result={result?.data?.result} />}
        />
        <Route
          path="quiz"
          element={<QuizPage result={result?.data?.result} />}
        />
      </Routes>
    </div>
  );
}

export default UserDashboard;