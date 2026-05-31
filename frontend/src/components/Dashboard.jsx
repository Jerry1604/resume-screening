import { useState } from "react";
import API from "../api/api";
import ResumeUpload from "./ResumeUpload";
import JDInput from "./JDInput";
import Papa from "papaparse";

function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [jdText, setJdText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  //  RUN SCREENING
  const runScreening = async () => {
    if (!jdText.trim()) {
      setMessage("Enter or upload JD first ");
      return;
    }

    if (uploadedFiles.length === 0) {
      setMessage("Upload resumes first ");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/score", {
        jd: jdText,
        resumes: uploadedFiles
      });

      const data = res.data.ranked_candidates || res.data;
      setResults(data);
      setMessage(" Screening completed");

    } catch (err) {
      console.error(err);
      setMessage("Screening failed");
    }

    setLoading(false);
  };

  //  SORT + SEARCH
  const filteredResults = [...results]
  .filter((r) =>
    (r.candidate || "").toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) =>
    sortDesc ? b.score - a.score : a.score - b.score
  );
  
  //  EXPORT CSV
  const exportCSV = () => {
    const csv = Papa.unparse(
      results.map((r, i) => ({
        Rank: i + 1,
        Candidate: r.candidate,
        Score: r.score,
        SkillsMatch: r.matched_skills?.join(", "),
        MissingSkills: r.missing_skills?.join(", ")
      }))
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ranked_candidates.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center">
        Resume Screening System 
      </h1>

      {/* UPLOAD */}
      <ResumeUpload setUploadedFiles={setUploadedFiles} />

      {/* JD + BUTTON */}
      <div className="space-y-3">
        <JDInput setJdText={setJdText} />

        <div className="text-center">
          <button
            onClick={runScreening}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Candidates 🚀"}
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <p className="text-center font-semibold text-blue-600">
          {message}
        </p>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search candidate..."
        className="border p-2 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CONTROLS */}
      {results.length > 0 && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Sort by Score {sortDesc ? "↓" : "↑"}
          </button>

          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="border p-5 rounded-lg mt-4">

          <h2 className="text-2xl font-bold mb-4">
             Candidate Ranking
          </h2>

          {filteredResults.map((r, index) => (
            <div key={index} className="border p-4 rounded mb-3 bg-gray-50">

              <h3 className="text-lg font-bold">
                Rank #{index + 1}
              </h3>

              <p><b>Candidate:</b> {r.candidate}</p>
              <p><b>Total Score:</b> {r.score}</p>

              {/* <p><b>Skills:</b>{r.score_breakdown?.skills_score}</p> */}
              <p><b>Keyword:</b> {r.score_breakdown?.keyword_score}</p>
              <p><b>Experience:</b> {r.score_breakdown?.experience_score}</p>
              <p><b>Education:</b> {r.score_breakdown?.education_score}</p>
              <p>
  <b>Experience:</b> {r.experience_label}
</p>

<p>
  <b>Education:</b> {r.education}
</p>

              <div className="bg-white border p-2 text-xs max-h-40 overflow-auto mt-2">
                {r.resume_preview}
              </div>

              {r.matched_skills && (
                <p><b>Matched:</b> {r.matched_skills.join(", ")}</p>
              )}

              {r.missing_skills && (
                <p><b>Missing:</b> {r.missing_skills.join(", ")}</p>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Dashboard;