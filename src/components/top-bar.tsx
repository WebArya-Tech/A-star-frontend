import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import "./component.css";

const TopBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-[#003366] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between h-14">
        {/* Left: Contact Icons (Phone & WhatsApp) */}
        <div className="flex items-center gap-6">
          {/* Phone Icon */}
          <a
            href="tel:8861919000"
            className="inline-flex items-center gap-1 hover:text-[#FFD600] transition"
            title="Call us"
          >
            <Phone className="h-6 w-6" />
            <span className="text-sm font-medium hidden xl:inline">+91-886 191 9000</span>
          </a>

          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/918073539524"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition"
            title="WhatsApp us"
          >
            <FaWhatsapp className="h-6 w-6" />
            <span className="text-sm font-medium hidden xl:inline">+91-807 353 9524</span>
          </a>
        </div>

        {/* Center/Right: Navigation & Actions (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <Link to="/testimonials" className="text-xs font-medium hover:text-[#FFD600] transition">
            Testimonials
          </Link>
          <Link to="/contact" className="text-xs font-medium hover:text-[#FFD600] transition">
            Contact Us
          </Link>
          <Link to="/blog" className="text-xs font-medium hover:text-[#FFD600] transition">
            Blogs
          </Link>
          <Link
            to="/demoform"
            className="bg-[#0056b3] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-[#007bff] transition"
          >
            Schedule Demo
          </Link>
          <Link
            to="/login"
            className="text-xs text-[#FFD600] font-semibold hover:text-white transition"
          >
            Login
          </Link>
          {/* Sign Up removed from top bar per request (hidden from users) */}
          {false && (
            <Link
              to="/signup"
              className="text-xs bg-white text-[#003366] px-3 py-1 rounded font-semibold hover:bg-[#FFD600] transition"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-white hover:bg-opacity-10"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-[#003366] border-t border-[#002244] px-4 py-3">
          <div className="space-y-3 max-w-md">
            <div className="flex gap-4 pb-3 border-b border-[#002244]">
              <a href="tel:8861919000" className="flex-1 text-center text-[#FFD600] font-bold text-xs">☎️ Call</a>
              <a href="https://wa.me/918073539524" target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[#FFD600] font-bold text-xs">💬 WhatsApp</a>
            </div>
            <Link to="/demoform" className="block bg-[#0056b3] text-white px-3 py-2 rounded text-xs font-semibold">Schedule Demo</Link>
            <Link to="/testimonials" className="block text-white text-xs hover:text-[#FFD600]">Testimonials</Link>
            <Link to="/contact" className="block text-white text-xs hover:text-[#FFD600]">Contact Us</Link>
            <Link to="/blog" className="block text-white text-xs hover:text-[#FFD600]">Blogs</Link>
            <Link to="/login" className="block text-[#FFD600] text-xs font-semibold">Login</Link>
            {/* Sign Up removed from mobile menu as well */}
            {false && (
              <Link to="/signup" className="block bg-white text-[#003366] px-3 py-1 rounded text-xs font-semibold">
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
