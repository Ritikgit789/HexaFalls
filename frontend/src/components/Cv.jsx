import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


function Cv() {
  const navigate = useNavigate();
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
      <div className="text-xl font-bold mb-2">CV Review</div>
      <div className="text-sm opacity-90">Let AI scan your resume and give feedback.</div>
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3, scale: 1.2 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white rounded-2xl blur-3xl"
      ></motion.div>
  <motion.button onClick={() => navigate('/cvreview')}
       whileHover={{ scale: 1.05, y: -2 }}
       className="
         relative flex items-center justify-center gap-3
         w-auto p-4 h-auto rounded-full
         mt-10
         bg-[#1C1A1C]
         transition-all duration-500 ease-in-out
         hover:bg-gradient-to-t hover:from-purple-600 hover:to-indigo-600
         hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.2),0_0_0_4px_rgba(255,255,255,0.2),0_0_100px_0_#9917FF]
       "
     ><motion.svg
  xmlns="http://www.w3.org/2000/svg"
  height="24"
  width="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  className="
    transition-all duration-700 ease-in-out
    text-gray-400
    group-hover:text-white
  "
  whileHover={{ scale: 1.2 }}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2
       M16 8l-4-4m0 0L8 8m4-4v12"
  />
</motion.svg>
 
       <span className="font-semibold text-gray-400 text-md transition-colors duration-500 group-hover:text-white">
         Upload CV
       </span>
     </motion.button>
    </motion.div>
  );
}

export default Cv;
