"use client";
import Link from "next/link";
import { Trophy, List, Users, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Dashboard() {
  const options = [
    { title: "Scoreboards", description: "Manage live match scoreboards.", link: "/scoreboards", icon: <Trophy size={40} /> },
    { title: "Draw Sheet", description: "View and organize match draws.", link: "/draw-sheet", icon: <List size={40} /> },
    { title: "Attendance", description: "Track player attendance and status.", link: "/attendance", icon: <Users size={40} /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="dashboard-bg-wrapper">
        <div className="dashboard-images-slider">
          <img src="/img1.avif" alt="Karate Background 1" />
          <img src="/img2.webp" alt="Karate Background 2" />
          <img src="/img3.webp" alt="Karate Background 3" />
        </div>
        <div className="dashboard-gradient-bg"></div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex flex-col items-center justify-center text-white relative z-10 py-20 pt-52">
        <h1 className="text-5xl font-extrabold mb-16 drop-shadow-lg">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl px-4">
          {options.map((option, index) => (
            <Link
              key={index}
              href={option.link}
              className="dashboard-card text-center py-10 px-6 rounded-xl bg-black/50 hover:bg-black/70 transition-all"
            >
              <div className="flex justify-center mb-6">{option.icon}</div>
              <h2 className="text-3xl font-bold mb-4">{option.title}</h2>
              <p className="text-lg opacity-90">{option.description}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black bg-opacity-80 text-white backdrop-blur-md pt-12 pb-6 mt-40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">About KumitePro</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              KumitePro is your all-in-one platform for martial arts events, live scoreboards,
              tournament draws, and attendance tracking. Simplify your competition management today!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Events</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Rules & Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Rules & Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Competition Rules</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-500"><Facebook size={28} /></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500"><Instagram size={28} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-sky-400"><Twitter size={28} /></a>
              <a href="#" aria-label="YouTube" className="hover:text-red-500"><Youtube size={28} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} KumitePro. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
