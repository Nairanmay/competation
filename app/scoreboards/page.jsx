"use client";
import { useState } from "react";
import Link from "next/link";
import { Sword, Medal, ArrowLeft } from "lucide-react";

export default function Scoreboards() {
  const [hoverGradient, setHoverGradient] = useState("");

  const options = [
    {
      title: "Kata",
      description: "Access kata scoreboards for your events.",
      link: "/scoreboards/kata",
      hoverClass: "hover-red",
      icon: <Medal size={50} />,
    },
    {
      title: "Kumite",
      description: "Manage kumite match scoreboards easily.",
      link: "/scoreboards/kumite",
      hoverClass: "hover-blue",
      icon: <Sword size={50} />,
    },
  ];

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center text-white p-8 overflow-hidden transition-all duration-700`}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 w-full h-full">
        <div className="default-gradient"></div>
        <div
          className={`hover-gradient ${hoverGradient}`}
        ></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-opacity-60 transition"
        >
          <ArrowLeft size={20} /> Back
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-12 drop-shadow-lg z-10">
        Scoreboards
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl z-10">
        {options.map((option, index) => (
          <Link
            key={index}
            href={option.link}
            className="bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-10 text-center shadow-xl hover:scale-105 transition transform hover:bg-opacity-70 border border-gray-700 hover:border-white"
            onMouseEnter={() => setHoverGradient(option.hoverClass)}
            onMouseLeave={() => setHoverGradient("")}
          >
            <div className="flex justify-center mb-6">{option.icon}</div>
            <h2 className="text-3xl font-bold mb-4">{option.title}</h2>
            <p className="text-lg opacity-80">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
