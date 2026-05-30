import { useState, useRef } from "react";
import API from "../api/api";

function ResumeUpload({ setUploadedFiles }) {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpload = async () => {

    if (!files.length) {
      alert("Please select resumes 📄");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    for (let file of files) {
      formData.append("files", file);
    }

    try {

      const response = await API.post(
        "/upload-resumes",
        formData
      );

      console.log(response.data);

      // 🔥 SAVE TO DASHBOARD STATE
      setUploadedFiles(
        response.data.uploaded_files
      );

      alert(
        "🚀 Resumes uploaded successfully!"
      );

      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {

      console.error(error);

      alert("❌ Upload failed");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="flex flex-col items-center gap-4">

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setFiles([...e.target.files])
        }
        className="border p-2 rounded"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          bg-blue-500
          hover:bg-blue-700
          text-white
          px-6 py-2
          rounded
        "
      >
        {loading
          ? "Uploading..."
          : "Upload Resume"}
      </button>

    </div>
  );
}

export default ResumeUpload;