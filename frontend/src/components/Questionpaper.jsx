import React from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


function Questionpaper() {
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
    
      <div className="text-xl font-bold mb-2">Question Paper Generation</div>
      <div className="text-sm opacity-90">Create customized question papers with our AI-based tool.</div>

      {/* Optional hover glow */}
         <motion.div
           initial={{ opacity: 0 }}
           whileHover={{ opacity: 0.3, scale: 1.2 }}
           transition={{ duration: 0.3 }}
           className="absolute inset-0 bg-white rounded-2xl blur-3xl"
         ></motion.div>
         <motion.button
              onClick={() => navigate('/Qpgenerator')}
              whileTap={{ scale: 0.95 }}
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
                height="24"
                width="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="
                  transition-all duration-700 ease-in-out
                  text-gray-400
                  group-hover:text-white
                "
                whileHover={{ scale: 1.2 }}
              >
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"/>
              </motion.svg>
              <span className="font-semibold text-gray-400 text-md transition-colors duration-500 group-hover:text-white">
                Generate
              </span>
            </motion.button>
       </motion.div>
  );
}

export default Questionpaper;


