import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import FeaturesGrid from "../components/Home/FeaturesGrid";
import { FaBookOpen } from "react-icons/fa";
import Modal from "../components/auth/Modal";
import { LoginForm, SignupForm } from "../components/auth/AuthForms";

export default function Home() {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="bg-[#36454F] min-h-screen flex flex-col items-center justify-center text-white text-center">
      
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1 }}
        className="text-6xl text-[#53C844] mb-4"
      >
        <FaBookOpen />
      </motion.div>

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-2"
      >
        AI-Powered Study Assistant
      </motion.h1>

      {/* Description */}
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1, delay: 0.5 }} 
        className="text-lg text-gray-300 mb-6"
      >
        Upload your lecture materials and get summaries, flashcards, quizzes, and more!
      </motion.p>

      {/* Get Started Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <button onClick={() => setIsLoginOpen(true)} className="bg-[#53C844] text-white px-6 py-3 rounded-lg text-lg hover:bg-green-500 transition">
          Get Started
        </button>
        <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm onClose={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} />
      </Modal>

      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <SignupForm onClose={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} />
      </Modal>
      </motion.div>

      {/* Features Section */}
      <FeaturesGrid />
    </div>
  );
}
