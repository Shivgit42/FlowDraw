import Link from "next/link";

export default function ReadyToStart() {
  return (
    <section className="py-20 px-6 flex justify-center bg-[#0E0E17]">
      <div className="bg-gradient-to-br from-[#1E40FF]/15 via-[#4F7BFF]/10 to-[#1E40FF]/15 p-10 sm:p-16 rounded-2xl shadow-[0_0_30px_rgba(30,64,255,0.15)] flex flex-col items-center text-center max-w-5xl w-full border border-[#1E40FF]/30 hover:border-[#1E40FF]/50 transition-all duration-300">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
          Ready to{" "}
          <span className="relative text-[#1E40FF]">
            Start?
            <span className="absolute inset-x-0 bottom-1 h-[5px] bg-gradient-to-r from-[#1E40FF]/60 to-[#4F7BFF]/60 rounded-full blur-sm opacity-60"></span>
          </span>
        </h2>

        <p className="max-w-2xl text-gray-300 text-base sm:text-lg mb-10 leading-relaxed font-medium">
          Join thousands of creative minds using{" "}
          <span className="text-[#4F7BFF] font-semibold">FlowDraw</span> to
          brainstorm, sketch, and bring ideas to life — all in real-time.
        </p>

        <Link
          href="/api/auth/signin"
          className="bg-gradient-to-r from-[#1E40FF] to-[#4F7BFF] px-10 py-4 rounded-xl text-lg font-bold text-white shadow-[0_0_25px_rgba(30,64,255,0.4)] hover:shadow-[0_0_35px_rgba(30,64,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
}
