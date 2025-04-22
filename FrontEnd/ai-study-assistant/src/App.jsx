import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ActionSelector from "./components/ActionSelector";
import SummaryPage from "./pages/SummaryPage";
import FlashcardsPage from "./pages/FlashcardsPage";
// import QuizPage from "./pages/QuizPage";
import { uploadFile } from "./api";
import { Toaster, toast } from "sonner";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [selectedAction, setSelectedAction] = useState("summary");
  const [result, setResult] = useState(null);  // updated to null (instead of "")

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a file");
    toast.loading("Processing...");
    try {
      const { data } = await uploadFile(file, selectedAction);
      setResult(data); // store the full data object
      console.log("Received result data:", data);

      toast.success("Done!");
    console.log(data);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    
  };

  return (
    <Router>
      <div className="max-w-3xl mx-auto p-8 space-y-6">
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📚 AI Study Assistant</h1>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600">Home</Link>
            <Link to="/summary" className="text-blue-600">Summary</Link>
            <Link to="/flashcards" className="text-blue-600">Flashcards</Link>
            {/* <Link to="/quiz" className="text-blue-600">Quiz</Link> */}
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
                  disabled={!file}
                  className={`mt-4 w-full py-2 rounded ${
                    file
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  
                >
                  Generate
                </button>
              </>
            }
          />
          <Route
            path="/summary"
            element={<SummaryPage result={result?.result} />}
          />
          <Route
            path="/flashcards"
            element={<FlashcardsPage result={result} />}
          />
          {/* <Route path="/quiz" element={<QuizPage result={result} />} /> */}
        </Routes>

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
