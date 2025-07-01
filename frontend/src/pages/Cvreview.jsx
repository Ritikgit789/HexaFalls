import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function extractScoreFromHTML(html) {
  if (!html) return 0;
  // Looser regex: grabs first number followed by %
  const match = html.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}


function extractDecisionFromHTML(html) {
  if (!html) return "N/A";
  // Simpler pattern: finds "Decision: Accept" type text
  const match = html.match(/Decision:\s*([^<\n]*)/i);
  return match ? match[1].trim() : "N/A";
}

function Cvreview() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("✅ Data received:", data);

      if (data.error) {
        alert("Server error: " + data.error);
        return;
      }

      const html = data.html ?? "<p>No suggestions found.</p>";

      setSummary({
        html_suggestions: html,
        score: extractScoreFromHTML(html),
        decision: extractDecisionFromHTML(html)
      });

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        CV Review & Smart Match
      </h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-white flex flex-col items-center">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-purple-50 file:text-purple-700
                     hover:file:bg-purple-100"
        />
        <button
          onClick={handleAnalyze}
          className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-full transition duration-300 font-semibold"
        >
          Upload & Analyze
        </button>
      </div>

      {loading && (
        <div className="text-center mt-8 text-purple-600 animate-pulse">
          🔍 Analyzing your CV...
        </div>
      )}

      {summary && (
        <div className="mt-10 space-y-6">
          <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="w-52 h-52 mx-auto">
              <Doughnut
                data={{
                  labels: ["Match", "Gap"],
                  datasets: [
                    {
                      data: [summary.score, 100 - summary.score],
                      backgroundColor: ["#8b5cf6", "#4b5563"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  cutout: "75%",
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#fff" } },
                    datalabels: {
                      display: true,
                      formatter: (_, context) => {
                        if (context.dataIndex === 0) {
                          return `${summary.score}%`;
                        }
                        return "";
                      },
                      color: "#fff",
                      font: { weight: "bold", size: 20 },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-6 md:mt-0 space-y-2">
              <p>
                <span className="font-bold">Match Score:</span> {summary.score}%
              </p>
              <p>
                <span className="font-bold">Decision:</span> {summary.decision}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">
              Suggestions & Improvements
            </h2>
            <div
              className="text-sm prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: summary.html_suggestions }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Cvreview;
