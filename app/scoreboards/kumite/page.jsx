"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function KumiteScoreboard() {
  // const searchParams = useSearchParams();
  // const competitionTitle = searchParams.get("title") || "Competition Title";

 const [redPlayerName, setRedPlayerName] = useState("");
const [bluePlayerName, setBluePlayerName] = useState("");

const redNameRef = useRef(null);
const blueNameRef = useRef(null);

 
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [timer, setTimer] = useState(180); // default 3 min
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [flipSides, setFlipSides] = useState(false);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [customTime, setCustomTime] = useState(180);
  const [customGap, setCustomGap] = useState(8);
  const [winningGap, setWinningGap] = useState(8);

  // Penalties
const [redPenalties, setRedPenalties] = useState({
  C1: false, C2: false, C3: false, H: false, HC: false, S: false
});
const [bluePenalties, setBluePenalties] = useState({
  C1: false, C2: false, C3: false, H: false, HC: false, S: false
});


  // Senshu
  const [senshuRed, setSenshuRed] = useState(false);
  const [senshuBlue, setSenshuBlue] = useState(false);
  const [firstPoint, setFirstPoint] = useState(false);

  // Audio refs
  const warningSound = useRef(null);
  const victorySound = useRef(null);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;

    
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && timer > 0 && !winner) {
      const id = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (timer === 0 && !winner) {
      declareWinner();
    }
  }, [isRunning, timer, winner]);

  // Double whistle at 15 seconds
  useEffect(() => {
    if (timer === 15 && warningSound.current) {
      warningSound.current.play();
    }
  }, [timer]);

  // Long whistle on victory
  useEffect(() => {
    if (winner && winner !== "draw" && victorySound.current) {
      victorySound.current.play();
    }
  }, [winner]);
//used for spacebar to start/stop timer
  useEffect(() => {
  const handleSpace = (e) => {
    if (e.code === "Space") {
      e.preventDefault(); // Prevent page scroll
      startStopTimer();
    }
  };

  window.addEventListener("keydown", handleSpace);
  return () => window.removeEventListener("keydown", handleSpace);
}, [isRunning, winner]);

  // Check win by gap
  useEffect(() => {
    if (redScore >= winningGap && !winner) {
      setWinner("red");
      setIsRunning(false);
      clearInterval(intervalId);
    }
    if (blueScore >= winningGap && !winner) {
      setWinner("blue");
      setIsRunning(false);
      clearInterval(intervalId);
    }
  }, [redScore, blueScore, winningGap]);

  const declareWinner = () => {
    if (redScore > blueScore) {
      setWinner("red");
    } else if (blueScore > redScore) {
      setWinner("blue");
    } else {
      if (senshuRed) setWinner("red");
      else if (senshuBlue) setWinner("blue");
      else setWinner("draw");
    }
    setIsRunning(false);
    clearInterval(intervalId);
  };

  const startStopTimer = () => {
    if (winner) return;
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const resetMatch = () => {
    setRedScore(0);
    setBlueScore(0);
    setTimer(customTime);
    setIsRunning(false);
    setWinner(null);
    setRedPenalties({ C1: 0, C2: 0 });
    setBluePenalties({ C1: 0, C2: 0 });
    setSenshuRed(false);
    setSenshuBlue(false);
    setFirstPoint(false);
    clearInterval(intervalId);
    setRedPlayerName("");
setBluePlayerName("");

  };

  const addPoints = (color, points) => {
    if (winner || points <= 0) return;

    if (!firstPoint) {
      if (color === "red") setSenshuRed(true);
      else setSenshuBlue(true);
      setFirstPoint(true);
    }

    if (color === "red") setRedScore(redScore + points);
    else setBlueScore(blueScore + points);
  };

  const subtractPoint = (color) => {
    if (winner) return;
    if (color === "red" && redScore > 0) setRedScore(redScore - 1);
    if (color === "blue" && blueScore > 0) setBlueScore(blueScore - 1);
  };

const togglePenalty = (color, type) => {
  if (winner) return;

  if (color === "red") {
    setRedPenalties((prev) => {
      const updated = { ...prev, [type]: !prev[type] };

      if (type === "HC" && updated.HC) {
        setWinner("blue"); // Opponent wins
        setIsRunning(false);
        clearInterval(intervalId);
      }
      return updated;
    });
  } else {
    setBluePenalties((prev) => {
      const updated = { ...prev, [type]: !prev[type] };

      if (type === "HC" && updated.HC) {
        setWinner("red"); // Opponent wins
        setIsRunning(false);
        clearInterval(intervalId);
      }
      return updated;
    });
  }
};


  const applySettings = () => {
    setTimer(customTime);
    setWinningGap(customGap);
    setShowSettings(false);
    resetMatch();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative text-white bg-[#121212]">
        {/* Gradient Background */}
  <div
    className={`absolute inset-0 opacity-40 transition-all duration-700 animate-gradient ${
      flipSides ? "gradient-reverse" : "gradient-normal"
    }`}
    style={{
      backgroundImage: flipSides
        ? "linear-gradient(to right, #2563eb, #b91c1c)"
        : "linear-gradient(to right, #b91c1c, #2563eb)",
    }}
  ></div>
{/* back button */}
   <div className="absolute top-6 right-6 z-50">
  <Link
    href="./"
    className="flex items-center gap-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-opacity-60 transition"
  >
    <ArrowLeft size={20} /> Back
  </Link>
</div>
  {/* Audio */}
  <audio ref={warningSound} src="/sounds/double-whistle.mp3" preload="auto"></audio>
  <audio ref={victorySound} src="/sounds/long-whistle.mp3" preload="auto"></audio>

  {/* Competition Title (Fixed at Top) */}
  <div className="absolute top-6 w-full flex justify-center z-30 pb-6">
    <h2 className="text-4xl sm:text-5xl font-bold text-white glow-text ">
      Default Kumite Scoreboard Title
    </h2>

  </div>
   <h1 className="text-4xl font-bold mb-4 z-10 glow-text pt-12">
  {winner ? (winner === "draw" ? "Draw!" : `${winner.toUpperCase()} Wins!`) : "Kumite Scoreboard"}
</h1>


      {/* Settings & Flip Button */}
      <div className="flex gap-4 mb-6 z-10">
        <button
          onClick={() => setShowSettings(true)}
          className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          ⚙ Settings
        </button>
        <button
          onClick={() => setFlipSides(!flipSides)}
          className="bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Switch Sides
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h2 className="text-2xl mb-4">Settings</h2>
            <label className="block mb-2">Select Timer:</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[60, 90, 120, 180, 300].map((time) => (
                <button
                  key={time}
                  onClick={() => setCustomTime(time)}
                  className={`p-2 rounded ${
                    customTime === time ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <label>Custom Timer (sec):</label>
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(Number(e.target.value))}
                className="w-full p-2 mt-1 bg-gray-800 rounded"
              />
            </div>
            <div className="mb-4">
              <label>Winning Gap:</label>
              <input
                type="number"
                value={customGap}
                onChange={(e) => setCustomGap(Number(e.target.value))}
                className="w-full p-2 mt-1 bg-gray-800 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={applySettings}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
    <div className="mt-16">
  <div
    className={`flex items-start justify-between w-full max-w-full z-10 px-1 ${flipSides ? "flex-row-reverse" : ""}`}
  >
        {/* Red Side */}
        <div className="flex flex-col items-center w-1/3">
     <div className="flex flex-col items-center w-1/3">
  {/* Player Label & Senshu */}
  <div className="flex items-center gap-3 mb-2">
    <h2 className="text-5xl font-bold text-red-400 glow-text">Red</h2>
    {senshuRed && (
      <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-yellow-400 text-yellow-400 font-bold text-2xl animate-pulse">
        S
      </div>
    )}
  </div>

  {/* Editable Player Name */}
<input
  ref={redNameRef}
  type="text"
  value={redPlayerName}
  onChange={(e) => setRedPlayerName(e.target.value.toUpperCase())}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      blueNameRef.current.focus(); // Move to Blue input
    }
  }}
  className={`bg-transparent border-b-2 border-red-400 text-center text-3xl font-bold outline-none w-56 uppercase placeholder-gray-500
    ${winner === "red" ? "text-yellow-400 glow-gold" : ""}
  `}
  placeholder="ENTER NAME"
/>

</div>


          
          <p className="text-[10rem] font-extrabold glow-text">{redScore}</p>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => addPoints("red", 3)} className="bg-gray-800 text-red-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Ippon</button>
            <button onClick={() => addPoints("red", 2)} className="bg-gray-800 text-red-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Waza</button>
            <button onClick={() => addPoints("red", 1)} className="bg-gray-800 text-red-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Yuko</button>
            <button onClick={() => subtractPoint("red")} className="bg-gray-700 px-4 py-3 rounded-xl text-2xl hover:bg-gray-600">–</button>
          </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
  {["C1", "C2", "C3", "H", "HC", "S"].map((pen) => (
    <div
      key={pen}
      onClick={() => togglePenalty("red", pen)}
      className={`w-16 h-16 flex items-center justify-center rounded-lg border-4 text-2xl font-bold cursor-pointer transition-all duration-300
        ${redPenalties[pen] ? "bg-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-400" : "bg-gray-800 border-gray-600 text-white"}
      `}
    >
      {pen}
    </div>
  ))}
</div>

        </div>

        {/* Timer */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <div className={`text-[12rem] font-mono mb-8 glow-text ${timer <= 15 ? "text-red-500" : ""}`}>
            {formatTime(timer)}
          </div>
          <div className="flex gap-6">
            <button onClick={startStopTimer} className="bg-green-700 hover:bg-green-600 px-8 py-4 rounded-xl text-2xl">
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={resetMatch} className="bg-red-700 hover:bg-red-600 px-8 py-4 rounded-xl text-2xl">
              Reset
            </button>
            </div>
        <div className="mt-4 text-xl font-semibold text-gray-300">
  Winning Gap: <span className="text-white">{winningGap}</span>
</div>

        </div>

        {/* Blue Side */}
        <div className="flex flex-col items-center w-1/3">
        {/* blue name and senshu symbol */}
      <div className="flex flex-col items-center w-1/3">
  {/* Player Label & Senshu */}
  <div className="flex items-center gap-3 mb-2">
    <h2 className="text-5xl font-bold text-blue-400 glow-text">Blue</h2>
    {senshuBlue && (
      <div className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-yellow-400 text-yellow-400 font-bold text-2xl animate-pulse">
        S
      </div>
    )}
  </div>

  {/* Editable Player Name */}
<input
  ref={blueNameRef}
  type="text"
  value={bluePlayerName}
  onChange={(e) => setBluePlayerName(e.target.value.toUpperCase())}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      redNameRef.current.blur(); // Remove focus after second input
    }
  }}
  className={`bg-transparent border-b-2 border-blue-400 text-center text-3xl font-bold outline-none w-56 uppercase placeholder-gray-500
    ${winner === "blue" ? "text-yellow-400 glow-gold" : ""}
  `}
  placeholder="ENTER NAME"
/>


</div>


          <p className="text-[10rem] font-extrabold glow-text">{blueScore}</p>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => addPoints("blue", 3)} className="bg-gray-800 text-blue-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Ippon</button>
            <button onClick={() => addPoints("blue", 2)} className="bg-gray-800 text-blue-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Waza</button>
            <button onClick={() => addPoints("blue", 1)} className="bg-gray-800 text-blue-400 font-bold px-6 py-3 rounded-xl text-xl hover:bg-gray-700">Yuko</button>
            <button onClick={() => subtractPoint("blue")} className="bg-gray-700 px-4 py-3 rounded-xl text-2xl hover:bg-gray-600">–</button>
          </div>
       <div className="grid grid-cols-3 gap-4 mt-6">
  {["C1", "C2", "C3", "H", "HC", "S"].map((pen) => (
    <div
      key={pen}
      onClick={() => togglePenalty("blue", pen)}
      className={`w-16 h-16 flex items-center justify-center rounded-lg border-4 text-2xl font-bold cursor-pointer transition-all duration-300
        ${bluePenalties[pen] ? "bg-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-400" : "bg-gray-800 border-gray-600 text-white"}
      `}
    >
      {pen}
    </div>
  ))}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
