import { useState } from "react";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// 🔧 Vite PDF worker fix (CRITICAL)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function JDInput({ setJdText }) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  // 📄 HANDLE FILE UPLOAD
  const handleFileUpload = async (file) => {
    if (!file) return;

    setFileName(file.name);

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      // TXT FILE
      if (ext === "txt") {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target.result;
          setText(content);
          setJdText(content);
        };

        reader.readAsText(file);
      }

      // DOCX FILE
      else if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        setText(result.value);
        setJdText(result.value);
      }

      // PDF FILE
      else if (ext === "pdf") {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        setText(fullText);
        setJdText(fullText);
      }

      // ❌ UNSUPPORTED FILE
      else {
        alert("Unsupported file type. Please upload PDF, DOCX, or TXT.");
      }
    } catch (err) {
      console.error("File parsing error:", err);
      alert("Failed to read file. Please try another file.");
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 space-y-5 shadow-md">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Job Description
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter or upload a JD for candidate matching
        </p>
      </div>

      {/* MODE SWITCH */}
      <div className="flex gap-3">

        {/* TEXT MODE */}
        <button
          onClick={() => setMode("text")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border
          ${
            mode === "text"
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
        >
          Enter JD
        </button>

        {/* FILE MODE */}
        <button
          onClick={() => setMode("file")}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border
          ${
            mode === "file"
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          }`}
        >
          Upload JD
        </button>
      </div>

      {/* TEXT INPUT */}
      {mode === "text" && (
        <textarea
          rows="8"
          placeholder="Paste job description here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setJdText(e.target.value);
          }}
          className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-700
          focus:ring-2 focus:ring-slate-400 outline-none transition"
        />
      )}

      {/* FILE UPLOAD */}
      {mode === "file" && (
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition">

          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="w-full text-slate-600"
          />

          <p className="text-sm text-slate-500 mt-2">
            Upload JD file (PDF / DOCX / TXT)
          </p>

          {fileName && (
            <p className="mt-2 text-sm text-slate-700">
              📄 {fileName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default JDInput;