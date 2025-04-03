import { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    // Mock file upload logic
    console.log("Uploaded file:", file);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
}