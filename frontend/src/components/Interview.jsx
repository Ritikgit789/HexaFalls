import React from "react";
import { motion } from "framer-motion";

function Interview() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        relative w-60 h-80 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400
        rounded-2xl shadow-xl flex flex-col justify-center items-center
        text-white text-center p-6 overflow-hidden
      "
    >
      <div className="text-xl font-bold mb-2">Job finder</div>
      <div className="text-sm opacity-90">
        Ace your job search with our AI-driven mock interview platform.
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white rounded-2xl blur-3xl"
      ></motion.div>

      <motion.button
        onClick={() => window.location.href = "http://localhost:8501"}

        whileHover={{ scale: 1.05, y: -2 }}
        className="
    relative flex items-center justify-center gap-3
    w-auto p-4 h-auto rounded-full
    my-4
    bg-[#1C1A1C]
    transition-all duration-500 ease-in-out
    hover:bg-gradient-to-t hover:from-purple-600 hover:to-indigo-600
    hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.2),0_0_0_4px_rgba(255,255,255,0.2),0_0_100px_0_#9917FF]
  "
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-gray-400 transition-all duration-700 ease-in-out group-hover:text-white"
          whileHover={{ scale: 1.2 }}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .68.39 1.29 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.22.61.83 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.68 0-1.29.39-1.51 1z" />
        </motion.svg>
        <span className="font-semibold text-gray-400 text-md transition-colors duration-500 group-hover:text-white">
          find your job
        </span>
      </motion.button>
    </motion.div>
  );
}

export default Interview;
