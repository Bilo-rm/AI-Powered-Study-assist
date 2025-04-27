// HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import ActionSelector from "../components/ActionSelector";
import { uploadFile } from "../api";
import { toast } from "sonner";

function HomePage({ setResult }) {
  const [file, setFile] = useState(null);
  const [selectedAction, setSelectedAction] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a file");
    
    const toastId = toast.loading("Processing...");
    setIsLoading(true);
    
    try {
      const response = await uploadFile(file, selectedAction);
      setResult(response);
      
      toast.dismiss(toastId);
      toast.success("Done!");
      
      // Navigate based on selected action
      if (selectedAction === "summary") {
        navigate("/summary");
      } else if (selectedAction === "flashcards") {
        navigate("/flashcards");
      } else if (selectedAction === "quiz") {
        navigate("/quiz");
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
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Study Material</h2>
        <p className="text-gray-600">Upload your PDF, document, or text file to generate study aids</p>
      </div>
      
      <FileUpload onFileChange={setFile} />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Select what you want to create:</h3>
        <ActionSelector
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className={`mt-8 w-full py-3 rounded-lg font-medium flex items-center justify-center ${
          file && !isLoading
            ? "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            Generate
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Supported file formats: PDF, DOCX, TXT</p>
      </div>
    </div>
  );
}

export default HomePage;