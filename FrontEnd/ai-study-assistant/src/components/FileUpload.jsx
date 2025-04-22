function FileUpload({ onFileChange }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Upload Document</label>
        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="border p-2 rounded"
        />
      </div>
    );
  }
  
  export default FileUpload;
  