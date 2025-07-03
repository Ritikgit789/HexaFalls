import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import LoginModal from "./LoginModal";

function Navbar() {
  const [user] = useAuthState(auth);
  const [showModal, setShowModal] = useState(false);

  return (
    <nav className="flex justify-between bg-gray-900 text-white w-screen px-8 py-6 ">
      <Link className="text-3xl font-bold" to="/">
        Mockly
      </Link>

      <ul className="hidden md:flex space-x-8 font-semibold justify-center items-center">
        <li>
          <Link to="/Cvreview" className="hover:text-gray-200">
            CV Review
          </Link>
        </li>
        <li>
          <Link to="/Interviewcall" className="hover:text-gray-200">
            Interview
          </Link>
        </li>
        <li>
          <Link to="/Qpgenerator" className="hover:text-gray-200">
            Question Paper
          </Link>
        </li>
      </ul>

      <div className="flex items-center space-x-5">
        {user ? (
          <Link
            to="/Profile"
            className="flex items-center space-x-2 hover:text-gray-200"
          >
            <img
              src="/avatar.svg"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-purple-600 transition duration-300 hover:scale-105 invert"
            />
            <span className="hidden md:block">
              {user.displayName || user.email}
            </span>
          </Link>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="hover:text-gray-200 transition border-2 border-gray-200 px-4 py-2 rounded-full"
          >
            Login
          </button>
        )}

        {/* <button className="hover:text-yellow-400">
          <BsFillMoonStarsFill size={24} />
        </button> */}
      </div>

      {showModal && <LoginModal closeModal={() => setShowModal(false)} />}
    </nav>
  );
}

export default Navbar;
