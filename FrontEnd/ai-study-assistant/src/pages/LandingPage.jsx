import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LandingPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const response = await axios.post("http://localhost:5000/auth/signin", {
          email: formData.email,
          password: formData.password,
        });
        
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Call the onLogin prop to update auth state
        onLogin(response.data.user);
      } else {
        // Signup
        await axios.post("http://localhost:5000/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user", // Default role
        });
        
        // Switch to login form after successful signup
        setIsLogin(true);
        setFormData({ ...formData, password: "" });
        setError("Account created! Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-purple-700 text-3xl mr-2">📚</span>
            <span className="font-bold text-xl text-purple-800">AI Study Assistant</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mt-16 mb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            Transform Your Learning Experience
          </h1>
          <p className="text-xl text-purple-700 max-w-3xl mx-auto">
            Leverage AI to convert your study materials into powerful learning tools
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Features Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold mb-8">Why Choose AI Study Assistant?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Smart Summaries</h3>
                  <p className="mt-1">Extract key concepts and condense lengthy materials into concise summaries for quick review.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Interactive Flashcards</h3>
                  <p className="mt-1">Convert your notes into effective flashcards to strengthen memory retention and active recall.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Custom Quizzes</h3>
                  <p className="mt-1">Test your knowledge with automatically generated quizzes based on your study materials.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-medium">Saved History</h3>
                  <p className="mt-1">Access your past generated materials anytime for continuous learning and review.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Upload your study document (PDF format)</li>
                <li>Choose what you want to create: Summary, Flashcards, or Quiz</li>
                <li>Let our AI process your content</li>
                <li>Study more effectively with AI-generated learning tools</li>
              </ol>
            </div>
          </div>

          {/* Auth Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-purple-900">
                {isLogin ? "Welcome Back!" : "Join Us Today"}
              </h2>
              
              <div className="mb-6 text-gray-600">
                {isLogin 
                  ? "Sign in to access your personalized learning tools and saved materials."
                  : "Create an account to start transforming your study process with AI."}
              </div>
              
              {error && (
                <div className={`p-4 mb-6 rounded-lg ${error.includes("created") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 transition-colors duration-200"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      isLogin ? "Sign In" : "Create Account"
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
              
              {isLogin && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-center text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Testimonials or Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">For Students</h3>
            </div>
            <p className="text-gray-600">
              Maximize your study efficiency. Turn lengthy textbooks and lecture notes into concise summaries, flashcards, and quizzes that help you retain information better.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">For Educators</h3>
            </div>
            <p className="text-gray-600">
              Generate supplementary study materials for your students. Save time on creating review materials and help your students succeed with AI-powered learning tools.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">For Professionals</h3>
            </div>
            <p className="text-gray-600">
              Keep learning throughout your career. Quickly digest industry reports, research papers, and professional literature with our AI-powered tools for continuous learning.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AI Study Assistant. All rights reserved.</p>
          <div className="mt-2">
            <span>Terms of Service</span>
            <span className="mx-2">•</span>
            <span>Privacy Policy</span>
            <span className="mx-2">•</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;