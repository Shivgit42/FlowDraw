"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "../public/web-logo.svg";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0d0d24]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo + Name */}
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-lg">
            <Image src={Logo} alt="logo" width={25} height={25} />
          </div>
          <h1 className="text-2xl font-extrabold">FlowDraw</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="hover:text-purple-400 transition">
            Features
          </Link>
          <Link href="#whychoose" className="hover:text-purple-400 transition">
            Why Choose
          </Link>
          <Link href="#demo" className="hover:text-purple-400 transition">
            Demo
          </Link>
          <Link href="#contact" className="hover:text-purple-400 transition">
            Contact
          </Link>
          <Link
            href="/api/auth/signin"
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 rounded-lg text-white text-lg font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-purple-400 transition"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 bg-[#0d0d24]/95 border-t border-gray-700 space-y-4">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block hover:text-purple-400 transition"
          >
            Features
          </Link>
          <Link
            href="#whychoose"
            onClick={() => setIsOpen(false)}
            className="block hover:text-purple-400 transition"
          >
            Why Choose
          </Link>
          <Link
            href="#demo"
            onClick={() => setIsOpen(false)}
            className="block hover:text-purple-400 transition"
          >
            Demo
          </Link>
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block hover:text-purple-400 transition"
          >
            Contact
          </Link>
          <Link
            href="/api/auth/signin"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 rounded-lg text-white text-lg font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
