import { useState } from "react";
import API from "../api/api";

function AnalyzeForm() {

  const [jdText, setJdText] = useState("");

  const [results, setResults] = useState([]);

  const handleAnalyze = async () => {

    const response = await API.post(
      "/analyze",
      null,
      {
        params: {
          jd_text: jdText
        }
      }
    );

    setResults(response.data.ranked_candidates);

    console.log(response.data);
  };

  return (
    <div className="p-5">

      <textarea
        placeholder="Enter Job Description"
        className="border p-2 w-full"
        rows="6"
        onChange={(e) => setJdText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
      >
        Analyze
      </button>

      <div className="mt-5">

        {results.map((candidate, index) => (

          <div
            key={index}
            className="border p-3 mb-3 rounded"
          >

            <h2 className="font-bold">
              {candidate.candidate}
            </h2>

            <p>
              Score: {candidate.score}
            </p>

            <p>
              Matched Skills:
              {candidate.matched_skills.join(", ")}
            </p>

            <p>
              Missing Skills:
              {candidate.missing_skills.join(", ")}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AnalyzeForm;