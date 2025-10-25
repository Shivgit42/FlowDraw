const items = [
  {
    title: "Real-time Updates",
    desc: "See changes instantly as your team works together.",
  },
  {
    title: "Save Time",
    desc: "No more back-and-forth emails or file sharing.",
  },
  {
    title: "Access Anywhere",
    desc: "Work from any device, anywhere in the world.",
  },
  {
    title: "Stay Organized",
    desc: "Keep everything in one place, always accessible.",
  },
];

export default function WhyChoose() {
  return (
    <section
      id="whychoose"
      className="py-20 px-6 sm:px-10 bg-gradient-to-br from-[#0E0E17] via-[#121222] to-[#1A1A2D] text-center"
    >
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-14 leading-snug">
        Why Choose{" "}
        <span className="relative text-[#1E40FF]">
          FlowDraw?
          <span className="absolute inset-x-0 bottom-1 h-[5px] bg-gradient-to-r from-[#1E40FF]/60 to-[#4F7BFF]/60 rounded-full blur-sm opacity-60"></span>
        </span>
      </h2>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1A1A28] p-6 rounded-2xl border border-[#2b2b3f] hover:border-[#1E40FF]/50 hover:shadow-[0_0_25px_rgba(30,64,255,0.25)] transition-all duration-300 ease-out flex flex-col justify-center min-h-[200px] sm:min-h-[220px] group"
          >
            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#4F7BFF] transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
