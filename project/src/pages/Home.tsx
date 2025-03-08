import { auth, googleProvider, githubProvider } from "../firebase/config";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setIsOpen(false);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      setIsOpen(false);
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Top-right corner Login/Signup button */}
      <div className="absolute top-4 right-4">
        {!user && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg font-semibold transition"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* Display user info if logged in */}
      {user ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-screen"
        >
          <div className="bg-white shadow-lg rounded-xl p-6 w-80 text-center">
            <h2 className="text-2xl font-semibold">Welcome, {user.displayName}</h2>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="rounded-full w-20 h-20 mx-auto mt-4 border-2 border-gray-300"
              />
            )}
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full transition"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* Login Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white shadow-lg rounded-lg p-6 w-96"
          >
            <h2 className="text-2xl font-bold text-center mb-4">Login / Signup</h2>
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full mb-3 transition"
            >
              <FcGoogle className="mr-2 text-lg" /> Sign in with Google
            </button>
            <button
              onClick={signInWithGitHub}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded w-full transition"
            >
              <FaGithub className="mr-2 text-lg" /> Sign in with GitHub
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
