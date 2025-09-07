import Link from "next/link";

export default function ReadyToStart() {
  return (
    <section className="py-20 px-6 flex justify-center">
      <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20 p-10 sm:p-16 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-5xl w-full border border-purple-500/30">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to <span className="text-purple-400">Start?</span>
        </h2>

        <p className="max-w-2xl text-gray-300 text-base sm:text-lg mb-10 leading-relaxed">
          Join with creative folks using{" "}
          <span className="text-purple-400 font-medium">FlowDraw</span> to
          brainstorm, sketch, and bring ideas to life all in real-time.
        </p>

        <Link
          href="/api/auth/signin"
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-md hover:shadow-lg hover:opacity-90 transition"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
}
