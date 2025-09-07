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
      className="py-20 px-6 sm:px-10 bg-gradient-to-br from-[#14142b] via-[#1a1a33] to-[#1e1b4b] text-center"
    >
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
        Why Choose <span className="text-purple-400">FlowDraw?</span>
      </h2>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1f1f35] p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition flex flex-col justify-center min-h-[200px] sm:min-h-[220px]"
          >
            <h3 className="text-xl font-semibold mb-2 text-purple-400">
              {item.title}
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
