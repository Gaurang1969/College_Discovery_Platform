"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/colleges" className="text-xl font-bold text-blue-600">
            CollegeDiscover
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium">Colleges</Link>
            <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium">Compare</Link>
            {session && <Link href="/saved" className="text-gray-600 hover:text-blue-600 font-medium">Saved</Link>}
            
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{session.user?.email}</span>
                <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/colleges" })}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
          className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-6 h-0.5 bg-gray-600 mb-1" />
            <div className="w-6 h-0.5 bg-gray-600 mb-1" />
            <div className="w-6 h-0.5 bg-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link href="/colleges" className="px-2 text-gray-600" onClick={() => setMenuOpen(false)}>Colleges</Link>
            <Link href="/compare" className="px-2 text-gray-600" onClick={() => setMenuOpen(false)}>Compare</Link>
            {session && <Link href="/saved" className="px-2 text-gray-600" onClick={() => setMenuOpen(false)}>Saved</Link>}
            <div className="px-2">
              {session ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={() => signOut({ callbackUrl: "/colleges" })}>Logout</Button>
              ) : (
                <Link href="/login"><Button variant="primary" size="sm" className="w-full">Login</Button></Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}