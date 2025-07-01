import React from 'react';
import { motion } from 'framer-motion';
import Cv from './Cv';
import Interview from './Interview';
import Questionpaper from './Questionpaper';


function Cards() {
  return (
    <div className="bg-gray-950 py-12 px-4shadow-inner">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-12 px-4 rounded-xl shadow-inner max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <Cv />
            {/* <GenerateButton /> */}
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <Interview />
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <Questionpaper />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Cards;
