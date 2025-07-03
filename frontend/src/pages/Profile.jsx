import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");  // 🚀 redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 text-white">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-x-8 bg-gray-900 p-6 rounded-xl shadow-lg">
        <img
          src="avatar.svg" // Placeholder image, replace with user.photoURL if available
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover invert"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-300">{user.email}</p>
          <div className="flex space-x-4 mt-4">
            <button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-full transition font-semibold">
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
