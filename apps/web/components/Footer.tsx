import Image from "next/image";
import Link from "next/link";
import Logo from "../public/favicon.ico";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d24] text-gray-400 pt-16 pb-8 px-8 mt-20 border-t border-gray-800 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-white p-2 rounded-lg">
              <Image src={Logo} alt="logo" width={28} height={28} />
            </div>
            <h1 className="text-xl font-bold text-white">FlowDraw</h1>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
            The collaborative drawing tool to sketch, brainstorm, and create
            visual ideas with your team anywhere, anytime.
          </p>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-6">
            <Link
              href="https://github.com/Shivgit42"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://x.com/shivamranaaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/shivam-rana-a6427a1a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="#features"
                className="hover:text-purple-400 transition"
              >
                Features
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-purple-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-purple-400 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link href="" className="hover:text-purple-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="" className="hover:text-purple-400 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="" className="hover:text-purple-400 transition">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Connect</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="mailto:hello@flowdraw.com"
                className="hover:text-purple-400 transition"
              >
                hello@flowdraw.com
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className="hover:text-purple-400 transition"
              >
                Newsletter
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="hover:text-purple-400 transition"
              >
                Community
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-white">FlowDraw</span>. All rights reserved.
      </div>
    </footer>
  );
}
