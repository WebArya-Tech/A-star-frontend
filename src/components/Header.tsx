import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImage from '../assets/AStarClasses logo (31 March).png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const subjects = [
    { name: 'Physics', slug: 'physics' },
    { name: 'Chemistry', slug: 'chemistry' },
    { name: 'Economics', slug: 'economics' },
    { name: 'Mathematics', slug: 'math' },
    { name: 'Further Math', slug: 'further-math' },
    { name: 'Languages', slug: 'languages' },
    { name: 'Biology', slug: 'biology' }
  ];

  const counsellingRegions = [
    { name: 'European Colleges', slug: 'europe' },
    { name: 'American Universities', slug: 'usa' },
    { name: 'Singapore Colleges', slug: 'singapore' },
    { name: 'Indian Schools', slug: 'india' }
  ];

  const satTests = [
    { name: 'SAT', slug: 'sat' },
    { name: 'TMUA', slug: 'tmua' },
    { name: 'AMC', slug: 'amc' },
    { name: 'Advanced Placements', slug: 'ap' },
    { name: 'ACT', slug: 'act' }
  ];

  return (
    <header className="bg-white shadow-m ticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (left) */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src={logoImage} alt="A Star Classes Logo" className="h-14 w-14 object-contain" />
            <span className="text-lg font-bold italic text-gray-900 hidden sm:inline"><strong>A Star Classes</strong></span>
          </Link>

          {/* Navigation (right) */}
          <div className="flex-1 flex justify-end items-center">
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                Home
              </Link>

              {/* IGCSE Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('igcse')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                  <span>IGCSE</span>
                </button>
                {activeDropdown === 'igcse' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                    {subjects.map((subject) => (
                      <Link
                        key={subject.slug}
                        to={`/igcse/${subject.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                      >
                        {subject.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* AS/A Level Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('asalevel')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                  <span>AS/A Level</span>
                </button>
                {activeDropdown === 'asalevel' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                    {subjects.map((subject) => (
                      <Link
                        key={subject.slug}
                        to={`/as-a-level/${subject.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                      >
                        {subject.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Blogs link */}
              <Link to="/blog" className="text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                Blogs
              </Link>

              {/* Ask link */}
              <Link to="/ask" className="text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                Ask
              </Link>

              {/* Tutors link */}
              <Link to="/tutors" className="text-sm text-gray-700 hover:text-blue-800 font-medium transition-colors">
                Tutors
              </Link>

              {/* Search Bar */}
              <div className="ml-6 flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100 bg-gray-50">
            <nav className="space-y-2 px-4">
              <Link to="/" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Home
              </Link>
              <Link to="/igcse" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                IGCSE
              </Link>
              <Link to="/as-a-level" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                AS/A Level
              </Link>
              <Link to="/testimonials" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Testimonials
              </Link>
              <Link to="/tutors" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Tutors
              </Link>
              <Link to="/contact" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Contact Us
              </Link>
              <Link to="/blog" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Blogs
              </Link>
              <Link to="/ask" className="block text-gray-700 hover:text-blue-800 hover:bg-blue-50 font-medium px-2 py-2 rounded text-sm">
                Ask
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;