"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f10] via-[#111113] to-[#0a0a0c] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div
            className="w-full h-full rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6 0deg, #a855f7 120deg, #ec4899 240deg, transparent 360deg)",
              animationDuration: "1.5s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              maskImage: "radial-gradient(circle, transparent 60%, black 61%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 60%, black 61%)",
            }}
          />
        </div>

        {/* Text */}
        <p className="text-white text-sm tracking-wide animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
