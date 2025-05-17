import { useState, useRef } from 'react';

function FileUpload({ onFileChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };
  
  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };
  
  // Handle click to open file dialog
  const handleClick = () => {
    inputRef.current.click();
  };

  // Reset file selection
  const handleReset = (e) => {
    e.stopPropagation();
    setFileName('');
    onFileChange(null);
  };

  return (
    <div className="w-full">
      <label className="text-base font-medium text-gray-900 mb-2 block">Upload Document</label>
      
      {/* Drag & Drop Area */}
      <div 
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer
          ${dragActive 
            ? "border-purple-500 bg-purple-50" 
            : fileName 
              ? "border-purple-400 bg-purple-50" 
              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
          }`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.pdf,.docx,.doc,.pptx,.ppt"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {fileName ? (
            <>
              {/* File Selected State */}
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">File Selected</p>
                <p className="text-purple-600 break-all max-w-full text-center">{fileName}</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors bg-purple-100 px-3 py-1 rounded-full"
                >
                  Reset
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drag & Drop your file here
                </p>
                <p className="text-xs text-gray-500">or click to browse</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Supported Formats */}
      <p className="text-xs text-gray-500 mt-2">
        Supported formats: PDF, Word, PowerPoint, and Text files
      </p>
    </div>
  );
}

export default FileUpload;