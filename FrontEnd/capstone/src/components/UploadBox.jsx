import React from "react";

const UploadBox = () => {
  return (
    <div className="mt-6 flex justify-center">
      <input
        type="text"
        placeholder="Upload your lecture notes..."
        className="w-2/3 p-2 rounded bg-gray-700 text-white"
      />
      <button className="bg-green-500 p-2 ml-2 rounded">📎</button>
    </div>
  );
};

export default UploadBox;
