"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sword, Medal, ArrowLeft } from "lucide-react";
export default function KataScoreboard() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [judgeCount, setJudgeCount] = useState(7);

  const [competitionTitle] = useState("WKF KATA CHAMPIONSHIP 2025");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [round, setRound] = useState("");
  const [scores, setScores] = useState(Array(judgeCount).fill(""));
  const [result, setResult] = useState(null);

  const nameRef = useRef(null);
  const countryRef = useRef(null);
  const roundRef = useRef(null);
  const judgeRefs = useRef([]);

  useEffect(() => {
    if (setupComplete && nameRef.current) {
      nameRef.current.focus();
    }
  }, [setupComplete]);

  const handleJudgeSelection = (count) => {
    setJudgeCount(count);
    setScores(Array(count).fill(""));
    setSetupComplete(true);
  };

  const calculateScore = () => {
    const parsedScores = scores.map((s) => parseFloat(s)).filter((v) => !isNaN(v));
    if (parsedScores.length !== judgeCount) {
      setResult({ error: `Please enter all ${judgeCount} scores!` });
      return;
    }
    if (parsedScores.some((v) => v < 5.0 || v > 10.0)) {
      setResult({ error: "Scores must be between 5.0 and 10.0" });
      return;
    }
    const sorted = [...parsedScores].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, -1);
    const finalScore = trimmed.reduce((a, b) => a + b, 0).toFixed(2);
    setResult({
      name: name || "COMPETITOR",
      country: country || "COUNTRY",
      round: round || "ROUND",
      allScores: sorted,
      removed: [sorted[0], sorted[sorted.length - 1]],
      finalScore,
    });
  };

  const resetNameAndScores = () => {
    setName("");
    setScores(Array(judgeCount).fill(""));
    setResult(null);
    if (nameRef.current) {
      nameRef.current.focus();
    }
  };

  if (!setupComplete) {
    return (
      <main id="judge" className="min-h-screen flex flex-col justify-center items-center animated-bg text-white px-6">
         {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="./"
          className="flex items-center gap-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-opacity-60 transition"
        >
          <ArrowLeft size={20} /> Back
        </Link>
      </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-12 text-center">
          Select Number of Judges
        </h1>
        <div className="flex gap-8">
          {[5, 6, 7].map((count) => (
            <button
              key={count}
              onClick={() => handleJudgeSelection(count)}
              className="bg-white text-black font-bold px-12 py-6 rounded-xl hover:scale-110 transition text-3xl shadow-lg"
            >
              {count} Judges
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen animated-bg">
      <main className="flex-grow flex flex-col items-center py-10 px-6 text-white transition-all duration-700">
        {/* Competition Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-12 text-center uppercase drop-shadow-lg animate-fadeIn">
          {competitionTitle}
        </h1>

        {/* Change Judges Button */}
        <button
          onClick={() => setSetupComplete(false)}
          className="absolute top-6 left-6 bg-gray-900/70 px-4 py-2 rounded-full shadow-lg hover:scale-110 transition text-sm"
        >
          Change Judges
        </button>
  <div className="absolute top-6 right-6">
        <Link
          href="./"
          className="flex items-center gap-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-opacity-60 transition"
        >
          <ArrowLeft size={20} /> Back
        </Link>
      </div>
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 w-full max-w-7xl">
          {/* Left: Competitor Details */}
          <div className="flex flex-col md:w-1/3 space-y-6 items-start text-left">
            {/* Name */}
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="ENTER NAME"
              className="text-4xl md:text-5xl font-extrabold bg-transparent focus:outline-none border-b-4 border-transparent hover:border-white w-full placeholder-gray-300 uppercase transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  countryRef.current?.focus();
                }
              }}
            />

            {/* Country */}
            <input
              ref={countryRef}
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              placeholder="ENTER COUNTRY"
              className="text-2xl font-semibold bg-transparent focus:outline-none border-b-4 border-transparent hover:border-white w-full placeholder-gray-300 uppercase transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  roundRef.current?.focus();
                }
              }}
            />

            {/* Round */}
            <input
              ref={roundRef}
              value={round}
              onChange={(e) => setRound(e.target.value.toUpperCase())}
              placeholder="ENTER ROUND"
              className="text-2xl font-semibold bg-transparent focus:outline-none border-b-4 border-transparent hover:border-white w-full placeholder-gray-300 uppercase transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  judgeRefs.current[0]?.focus();
                }
              }}
            />

            {/* Final Score */}
            {result && !result.error && (
              <div className="mt-8 text-center w-full animate-fadeIn">
                <p className="text-gray-300 text-xl">FINAL SCORE</p>
                <p className="text-9xl font-extrabold text-green-400 drop-shadow-2xl">
                  {result.finalScore}
                </p>
              </div>
            )}
          </div>

          {/* Right: Judges Section */}
          <div className="flex-1 md:w-2/3 flex flex-col items-center gap-10 px-4">
            <h3 className="text-5xl font-bold mb-6">Judges' Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full justify-items-center">
              {scores.map((score, i) => (
                <div
                  key={i}
                  className="bg-black/60 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center transform transition duration-300 hover:scale-105"
                  style={{ width: "140px", height: "140px" }}
                >
                  <p className="text-xl font-semibold mb-4">Judge {i + 1}</p>
                  <input
                    ref={(el) => (judgeRefs.current[i] = el)}
                    type="number"
                    step="0.2"
                    min="5.0"
                    max="10.0"
                    placeholder="0.00"
                    className="p-3 text-center text-White text-3xl font-bold rounded-lg w-28 shadow-inner"
                    value={score}
                    onChange={(e) => {
                      const updated = [...scores];
                      updated[i] = e.target.value;
                      setScores(updated);
                    }}
                    onKeyDown={(e) => {
                      const cols = 4;
                      if (e.key === "Enter" || e.key === "ArrowRight") {
                        e.preventDefault();
                        judgeRefs.current[i + 1]?.focus();
                      }
                      if (e.key === "ArrowLeft" && i > 0) {
                        e.preventDefault();
                        judgeRefs.current[i - 1]?.focus();
                      }
                      if (e.key === "ArrowDown" && i + cols < scores.length) {
                        e.preventDefault();
                        judgeRefs.current[i + cols]?.focus();
                      }
                      if (e.key === "ArrowUp" && i - cols >= 0) {
                        e.preventDefault();
                        judgeRefs.current[i - cols]?.focus();
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-10 mt-6">
              <button
                onClick={calculateScore}
                className="bg-green-500 text-white font-bold px-14 py-6 rounded-full hover:scale-110 transition-all text-3xl shadow-lg"
              >
                Calculate
              </button>
              <button
                onClick={resetNameAndScores}
                className="bg-red-600 text-white font-bold px-14 py-6 rounded-full hover:scale-110 transition-all text-3xl shadow-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Extra Details */}
        <div className="mt-16 w-full max-w-5xl text-center">
          {result ? (
            result.error ? (
              <p className="text-yellow-300 text-3xl font-bold">{result.error}</p>
            ) : (
              <div className="animate-fadeIn space-y-4 text-2xl">
                <p>Scores: {result.allScores.join(", ")}</p>
                <p>
                  Removed: {result.removed[0]} (Lowest), {result.removed[1]} (Highest)
                </p>
              </div>
            )
          ) : (
            <p className="text-gray-200 text-2xl">Enter scores to see the result!</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 text-center w-full">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Black Pantherkan Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
