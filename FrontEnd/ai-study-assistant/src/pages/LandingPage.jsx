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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-6">📚 AI Study Assistant</h1>
            <p className="text-xl mb-6">
              Transform your study materials into interactive learning tools with AI
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Generate concise summaries</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Create flashcards for effective review</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Practice with auto-generated quizzes</span>
              </li>
            </ul>
          </div>

          {/* Auth Form */}
          <div className="md:w-1/2 p-12">
            <h2 className="text-2xl font-bold mb-6">
              {isLogin ? "Sign In" : "Create an Account"}
            </h2>
            
            {error && (
              <div className={`p-3 mb-4 rounded ${error.includes("created") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;