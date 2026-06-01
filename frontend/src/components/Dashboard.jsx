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

  const runScreening = async () => {
    if (!jdText.trim()) return setMessage("Enter or upload JD first");
    if (!uploadedFiles.length) return setMessage("Upload resumes first");

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/score", {
        jd: jdText,
        resumes: uploadedFiles,
      });

      const data = res.data.ranked_candidates || res.data;
      setResults(data);
      setMessage("Screening completed ✨");
    } catch (err) {
      console.error(err);
      setMessage("Screening failed");
    }

    setLoading(false);
  };

  const filteredResults = [...results]
    .filter((r) =>
      (r.candidate || "").toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));

  const exportCSV = () => {
    const csv = Papa.unparse(
      results.map((r, i) => ({
        Rank: i + 1,
        Candidate: r.candidate,
        Score: r.score,
        SkillsMatch: r.matched_skills?.join(", "),
        MissingSkills: r.missing_skills?.join(", "),
      })),
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ranked_candidates.csv";
    a.click();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#eef2f7] p-6">
      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-indigo-300 blur-[130px]" />
        <div className="absolute top-1/3 right-[-220px] w-[600px] h-[600px] bg-sky-300 blur-[150px]" />
        <div className="absolute bottom-[-200px] left-1/3 w-[520px] h-[520px] bg-blue-200 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Resume Screening System
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            AI-powered candidate ranking engine
          </p>
        </div>

        {/* UPLOAD */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-6">
          <ResumeUpload setUploadedFiles={setUploadedFiles} />
        </div>

        {/* JD */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-6 space-y-4">
          <JDInput setJdText={setJdText} />

          <div className="text-center">
            <button
              onClick={runScreening}
              disabled={loading}
              className={`px-10 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-sm
                ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
                }`}
            >
              {loading ? "Analyzing..." : "Analyze Candidates 🚀"}
            </button>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="text-center">
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm">
              {message}
            </span>
          </div>
        )}

        {/* SEARCH + CONTROLS */}
        {results.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              className="w-full md:w-1/2 px-4 py-2 rounded-xl border border-gray-200 bg-white
              focus:ring-2 focus:ring-indigo-300 outline-none text-gray-700"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200
  text-teal-700 hover:bg-teal-100 hover:shadow-md
  transition-all duration-300 hover:-translate-y-0.5"
              >
                Sort {sortDesc ? "↓" : "↑"}
              </button>

              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700
                text-white hover:scale-[1.02] transition"
              >
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Ranked Candidates
            </h2>

            {filteredResults.map((r, index) => (
              <div
                key={index}
                className="bg-white/85 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-6
                hover:shadow-xl hover:border-gray-300 transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    #{index + 1}{" "}
                    <span className="text-indigo-600">{r.candidate}</span>
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm shadow-sm">
                    {r.score}
                  </span>
                </div>

                {/* INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>Experience: {r.experience_label}</p>
                  <p>Education: {r.education}</p>
                  <p>Keyword: {r.score_breakdown?.keyword_score}</p>
                  <p>Exp Score: {r.score_breakdown?.experience_score}</p>
                  <p>Edu Score: {r.score_breakdown?.education_score}</p>
                </div>

                {/* PREVIEW */}
                <div className="mt-3 text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-32 overflow-auto text-gray-600">
                  {r.resume_preview}
                </div>

                {/* SKILLS */}
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <p className="text-emerald-700 font-medium">
                      Matched Skills
                    </p>
                    <p className="text-sm text-gray-700">
                      {(r.matched_skills || []).length
                        ? r.matched_skills.join(", ")
                        : "None"}
                    </p>
                  </div>

                  <div className="flex-1 bg-rose-50 border border-rose-200 rounded-xl p-3">
                    <p className="text-rose-700 font-medium">Missing Skills</p>
                    <p className="text-sm text-gray-700">
                      {(r.missing_skills || []).length
                        ? r.missing_skills.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
