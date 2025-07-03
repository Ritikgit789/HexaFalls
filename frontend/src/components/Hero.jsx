import React from 'react';

function Hero() {
  return (
    <div className="bg-gray-900 text-white flex flex-col justify-center items-center h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Empower Your Future with AI
      </h1>
      <p className="text-lg md:text-xl max-w-2xl mb-6">
        Experience the next generation of tools to enhance your career — 
        from AI-powered CV reviews to virtual interviews and smart question paper generators.
      </p>
         <button className="
      relative flex justify-center items-center rounded-md
      bg-[#183153] text-white font-bold tracking-widest
      overflow-hidden px-6 py-4
      shadow-lg transition duration-300
      before:content-[''] before:absolute before:right-0 before:w-0 before:h-full
      before:bg-[#ffd401] before:transition-all before:duration-400
      hover:before:w-full hover:before:left-0 hover:before:right-auto
      hover:text-[#183153]
    ">
      <span className="relative z-10 transition-transform duration-300 hover:scale-95">
        Get Started
      </span>
    </button>
    </div>
  );
}

export default Hero;
