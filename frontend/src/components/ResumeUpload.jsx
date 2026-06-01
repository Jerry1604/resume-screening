import { useState, useRef } from "react";
import API from "../api/api";

function ResumeUpload({ setUploadedFiles }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ FILE HANDLING WITH 500KB LIMIT
  const handleFiles = (fileList) => {
    const maxSize = 500 * 1024; // 500KB

    const validFiles = [];
    const rejected = [];

    for (let file of fileList) {
      if (file.size <= maxSize) {
        validFiles.push(file);
      } else {
        rejected.push(file.name);
      }
    }

    if (rejected.length > 0) {
      alert(
        `These files exceed 500KB and were removed:\n` +
        rejected.join(", ")
      );
    }

    setFiles(validFiles);
  };

  // ✅ DRAG EVENTS
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // ✅ UPLOAD
  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select resumes");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await API.post("/upload-resumes", formData);

      setUploadedFiles(response.data.uploaded_files);
      alert("Resumes uploaded successfully!");

      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-5">

      {/* TITLE */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Upload Resumes
        </h2>
        <p className="text-sm text-gray-500">
          Drag & drop or select files (Max 500KB each)
        </p>
      </div>

      {/* DROP AREA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${
            dragActive
              ? "border-blue-600 bg-blue-100 scale-[1.02]"
              : "border-blue-300 bg-blue-50/30 hover:border-blue-500"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="fileUpload"
        />

        <label
          htmlFor="fileUpload"
          className="cursor-pointer text-blue-600 font-medium"
        >
          Drag files here or click to browse
        </label>

        <p className="text-xs text-gray-400 mt-2">
          Supported: PDF, DOC, DOCX (≤ 500KB)
        </p>

        {dragActive && (
          <p className="text-blue-600 text-sm mt-3 animate-pulse">
            Drop files to upload ✨
          </p>
        )}
      </div>

      {/* FILE PREVIEW */}
      {files.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-3 max-h-32 overflow-auto">
          <p className="text-sm font-semibold mb-2 text-gray-700">
            Selected Files
          </p>

          {files.map((file, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>📄 {file.name}</span>
              <span className="text-gray-400">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className={`
          w-full relative overflow-hidden py-3 rounded-xl font-semibold text-white
          transition-all duration-300

          ${
            loading || files.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]"
          }
        `}
      >
        {/* shimmer effect */}
        {!loading && files.length > 0 && (
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
        )}

        <span className="relative z-10">
          {loading
            ? "Uploading..."
            : `Upload ${files.length} Resume${files.length > 1 ? "s" : ""} 🚀`}
        </span>
      </button>
    </div>
  );
}

export default ResumeUpload;


