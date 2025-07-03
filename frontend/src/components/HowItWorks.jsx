import React from 'react';
import { motion } from 'framer-motion';

function HowItWorks() {
  const steps = [
    {
      title: "Upload Your Data",
      desc: "Start by uploading your resume, questions or any files needed. Our platform securely processes your data.",
    },
    {
      title: "AI Analysis",
      desc: "Our advanced ML & LLM engines analyze your input to generate insights, mock interviews, and question papers.",
    },
    {
      title: "Get Results",
      desc: "Receive personalized results, suggestions and downloadable resources instantly on your dashboard.",
    },
  ];

  return (
    <div className="bg-gray-950 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-gray-400 mb-12">
          Understand the simple 3-step process that powers our platform.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                        p-6 rounded-xl shadow-xl border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
