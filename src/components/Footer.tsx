import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, X, FileText } from 'lucide-react';
import { FaWhatsapp, FaTwitter } from 'react-icons/fa';
import logoImage from '../assets/A-start logo.jpeg';

const Footer = () => {
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsGstModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logoImage} alt="A Star Classes Logo" className="h-14 w-14 object-contain" />
              <span className="text-xl font-bold italic"><strong>A Star Classes</strong></span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Expert online coaching for IGCSE & AS/A Level students. Achieve top grades with personalized instruction,
              comprehensive resources, and proven teaching methodologies.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-400" />
                <a href="tel:+918861919000" className="hover:text-yellow-400 transition-colors">
                  +91-886 191 9000
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <a href="mailto:astarclasses@ixpoe.com" className="hover:text-yellow-400 transition-colors">
                  astarclasses@ixpoe.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">No. 81, Ground Floor, Shar Space, Borewell Road, Nallurahalli, Whitefield, Bangalore - 560066, Karnataka</span>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-yellow-400" />
                <button
                  onClick={() => setIsGstModalOpen(true)}
                  className="text-gray-300 hover:text-yellow-400 transition-colors text-left"
                >
                  GST Number: 29AAECD7872Q1ZO
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/igcse" className="text-gray-300 hover:text-yellow-400 transition-colors">IGCSE</Link></li>
              <li><Link to="/as-a-level" className="text-gray-300 hover:text-yellow-400 transition-colors">AS/A Level</Link></li>
              <li><Link to="/testimonials" className="text-gray-300 hover:text-yellow-400 transition-colors">Testimonials</Link></li>
              <li><Link to="/tutors" className="text-gray-300 hover:text-yellow-400 transition-colors">Tutors</Link></li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors">Blog</Link></li>
              <li><Link to="/ask" className="text-gray-300 hover:text-yellow-400 transition-colors">Ask a Question</Link></li>
              <li><Link to="/demoform" className="text-gray-300 hover:text-yellow-400 transition-colors">Book a Demo</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2026 A Star Classes. All rights reserved.
            </p>

            {/* Credit Section */}
            <div className="mt-4 md:mt-0 pt-4 md:pt-0 md:border-l md:border-gray-700 md:pl-6 border-t md:border-t-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-gray-400">
                <span>Designed & Developed by</span>
                <a
                  href="https://webarya.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 font-medium hover:text-green-400 transition-colors"
                >
                  WebArya
                </a>
                <a
                  href="tel:+919187385124"
                  className="flex items-center gap-1 text-green-500 hover:text-green-400 transition-colors"
                  title="Call WebArya"
                >
                  <Phone size={12} />
                  +91 9187 385 124
                </a>
                <a
                  href="https://wa.me/919187385124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-500 hover:text-green-400 transition-colors"
                  title="WhatsApp WebArya"
                >
                  <FaWhatsapp size={12} />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex space-x-4 mt-4 md:mt-0 md:ml-auto">
              <a href="https://www.facebook.com/astarclasses" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/AStarClasses" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/classesastar/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/astarclasses" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@AStarClass" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="h-5 w-5 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M10 15l5.196-3L10 9v6z" />
                    <path fillRule="evenodd" d="M21.665 7.175a2.66 2.66 0 00-1.737-1.744C18.045 5 12 5 12 5s-6.045 0-7.928.431a2.66 2.66 0 00-1.737 1.744C2.5 9.074 2.5 12 2.5 12s0 2.926.835 4.825a2.66 2.66 0 001.737 1.744C5.955 19 12 19 12 19s6.045 0 7.928-.431a2.66 2.66 0 001.737-1.744C21.5 14.926 21.5 12 21.5 12s0-2.926-.835-4.825z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div >

      {/* GST Information Modal */}
      {
        isGstModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsGstModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">GST Details</h3>
                <button
                  onClick={() => setIsGstModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 text-gray-800 space-y-4">
                <div className="space-y-1">
                  <p className="font-bold italic text-lg text-blue-900"><strong>A Star Classes</strong></p>
                  <p className="font-semibold text-gray-700">DronaVyas Ixpoe Private Limited</p>
                </div>

                <div className="space-y-1 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  <p>No. 81, Ground Floor, Shar Space</p>
                  <p>Borewell Road, Nallurahalli, Whitefield</p>
                  <p>Bangalore - 560066</p>
                  <p>Karnataka</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">GST Number</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-blue-900">29AAECD7872Q1ZO</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 font-medium">+91-886 191 9000</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                <button
                  onClick={() => setIsGstModalOpen(false)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )
      }
    </footer >
  );
};

export default Footer;