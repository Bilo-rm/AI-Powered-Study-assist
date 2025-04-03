import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#0F0B0B] shadow-md w-full py-4 flex justify-center">
      <ul className="flex gap-8 text-lg font-semibold text-white">
        <li><Link to="/" className="hover:text-[#53C844]">Home</Link></li>
        <li><Link to="/features" className="hover:text-[#53C844]">Features</Link></li>
        <li><Link to="/login" className="hover:text-[#53C844]">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
