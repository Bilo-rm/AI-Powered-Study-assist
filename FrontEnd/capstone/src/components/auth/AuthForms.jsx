import { useState } from "react";

export function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logged in with:", email, password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button type="submit" className="w-full bg-[#53C844] text-white p-2 rounded-lg hover:bg-green-500">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Don't have an account? <span onClick={onClose} className="text-[#53C844] cursor-pointer">Sign Up</span>
      </p>
    </div>
  );
}

export function SignupForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signed up with:", email, password);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button type="submit" className="w-full bg-[#53C844] text-white p-2 rounded-lg hover:bg-green-500">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-gray-400">
        Already have an account? <span onClick={onClose} className="text-[#53C844] cursor-pointer">Login</span>
      </p>
    </div>
  );
}
