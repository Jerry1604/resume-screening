import { useState } from "react";

function JDInput({ setJdText }) {

  const [mode, setMode] = useState("text");

  const [text, setText] = useState("");

  return (

    <div className="border p-5 rounded-lg space-y-5">

      <h2 className="text-2xl font-semibold">
          Job Description
      </h2>

      {/* TOGGLE BUTTONS */}
      <div className="flex gap-4">

        <button
          onClick={() => setMode("text")}
          className={`
            px-5 py-2 rounded text-white

            ${mode === "text"
              ? "bg-green-600"
              : "bg-gray-500"
            }
          `}
        >
          Enter JD
        </button>

        <button
          onClick={() => setMode("file")}
          className={`
            px-5 py-2 rounded text-white

            ${mode === "file"
              ? "bg-blue-600"
              : "bg-gray-500"
            }
          `}
        >
           Upload JD
        </button>

      </div>

      {/* TEXT MODE */}
      {mode === "text" && (

        <textarea
          rows="8"
          placeholder="Enter Job Description..."
          value={text}
          onChange={(e) => {

            setText(e.target.value);

            // SEND TO DASHBOARD
            setJdText(e.target.value);
          }}
          className="
            border
            p-3
            w-full
            rounded
          "
        />
      )}

      {/* FILE MODE */}
      {mode === "file" && (

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="border p-2 rounded"
        />
      )}

    </div>
  );
}

export default JDInput;