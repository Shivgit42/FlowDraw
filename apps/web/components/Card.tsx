"use client";
import { LucideIcon } from "lucide-react";

export default function Card({
  CardIcon,
  onClick,
  title,
}: {
  CardIcon: LucideIcon;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full sm:w-[360px] md:w-[360px] rounded-2xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-purple-500/70 cursor-pointer"
      aria-label={title}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition" />
      {/* card */}
      <div className="relative h-[116px] sm:h-[130px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 flex items-center gap-4 transition-transform duration-300">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2D3848]/70 border border-white/10">
          <CardIcon size={28} color="#C9CBD1" />
        </div>
        <div className="text-base sm:text-lg font-semibold">{title}</div>
      </div>
    </button>
  );
}
