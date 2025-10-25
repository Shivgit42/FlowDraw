import Image from "next/image";
import Link from "next/link";
import Logo from "../public/favicon.ico";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E0E17] text-gray-400 pt-16 pb-8 px-8  border-t border-[#1E2A40] relative">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#0040FF] via-[#1E90FF] to-[#0040FF]"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo + Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Image src={Logo} alt="logo" width={28} height={28} />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              FlowDraw
            </h1>
          </div>

          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
            The collaborative drawing tool to sketch, brainstorm, and create
            visual ideas with your team anywhere, anytime.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-6">
            <Link
              href="https://github.com/Shivgit42"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1E90FF] transition duration-300"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://x.com/shivamranaaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1DA1F2] transition duration-300"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/shivam-rana-a6427a1a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0A66C2] transition duration-300"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="#features"
                className="hover:text-[#1E90FF] transition"
              >
                Features
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-[#1E90FF] transition">
                About
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-[#1E90FF] transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
          <ul className="space-y-3">
            <li>
              <Link href="" className="hover:text-[#1E90FF] transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="" className="hover:text-[#1E90FF] transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="" className="hover:text-[#1E90FF] transition">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Connect</h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="mailto:hello@flowdraw.com"
                className="hover:text-[#1E90FF] transition"
              >
                hello@flowdraw.com
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className="hover:text-[#1E90FF] transition"
              >
                Newsletter
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="hover:text-[#1E90FF] transition"
              >
                Community
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-12 pt-6 border-t border-[#1E2A40] text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">FlowDraw</span>. All rights
        reserved.
      </div>
    </footer>
  );
}
