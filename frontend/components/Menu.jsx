'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function RetroFlowMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-green-400 border-b-2 border-green-500 px-6 py-3 font-mono relative">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-widest pixelated">RetroFlow</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/editor" className="hover:text-green-300">Editor</Link>
          <Link href="/gallery" className="hover:text-green-300">Gallery</Link>
          <Link href="/about" className="hover:text-green-300">About</Link>
          <Link href="/contact" className="hover:text-green-300">Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-green-500 text-center md:hidden">
          <Link href="/editor" className="block py-2 hover:bg-green-700">Editor</Link>
          <Link href="/gallery" className="block py-2 hover:bg-green-700">Gallery</Link>
          <Link href="/about" className="block py-2 hover:bg-green-700">About</Link>
          <Link href="/contact" className="block py-2 hover:bg-green-700">Contact</Link>
        </div>
      )}
    </nav>
  );
}
