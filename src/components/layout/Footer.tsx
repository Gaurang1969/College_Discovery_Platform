import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          CollegeDiscover © 2026
        </p>
        <div className="flex gap-6">
          <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
            About
          </a>
          <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
            Contact
          </a>
          <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}