import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";

export default function LoginModal({ closeModal }) {
  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => handleLogin(githubProvider)}
            className="bg-white p-3 rounded-md hover:opacity-80 transition"
          >
            <img src="github-mark.svg" alt="GitHub" className="h-6 w-6" />
          </button>
          <button 
            onClick={() => handleLogin(googleProvider)}
            className="bg-white p-3 rounded-md hover:opacity-80 transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6"
              viewBox="0 0 48 48"
            >
              <path fill="#4285F4" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.1l6.6-6.6C35.2 2.2 29.9 0 24 0 14.6 0 6.5 5.6 2.7 13.7l7.9 6.2C12.4 13.3 17.7 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.6c0-1.5-.1-2.9-.4-4.3H24v8.2h12.4c-.6 3-2.4 5.5-5 7.2l7.7 6c4.5-4.1 7-10.1 7-17.1z"/>
              <path fill="#FBBC05" d="M10.6 28.7c-1-3-1-6.3 0-9.3l-7.9-6.2c-2.7 5.4-2.7 11.8 0 17.2l7.9-6.2z"/>
              <path fill="#EA4335" d="M24 46c6.5 0 12-2.1 16-5.6l-7.7-6c-2.2 1.5-5 2.3-8.3 2.3-6.3 0-11.6-3.8-13.5-9l-7.9 6.2C6.5 42.4 14.6 48 24 48z"/>
            </svg>
          </button>
        </div>
        <button
          onClick={closeModal}
          className="block mx-auto mt-4 text-gray-400 hover:text-red-900 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
