"use client";
import { useUserStore } from "@repo/store";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Logo from "../public/web-logo.svg";

export default function Navbar() {
  const { user, logoutUser } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logoutUser();
    signOut({ callbackUrl: "/" });
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0d0d24]/70 backdrop-blur-xl border-b border-white/10">
      {/* subtle top gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2 shadow">
            <Image src={Logo} alt="logo" width={26} height={26} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            FlowDraw
          </h1>
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          {user && (
            <div>
              <Image
                src={`${user?.photo}`}
                width={36}
                height={36}
                alt="ProfilePic"
                className="rounded-full cursor-pointer ring-0 hover:ring-2 hover:ring-purple-400 transition"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl border border-white/10 bg-[#111827]/90 backdrop-blur-xl z-50"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-3 text-sm text-white/90 border-b border-white/10 truncate">
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-3 text-red-400">
                      <LogOut size={16} />
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
