import {
  FaUsers,
  FaPen,
  FaImage,
  FaShareAlt,
  FaHandPointer,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUsers />,
    title: "Real-time Collaboration",
    desc: "Work together seamlessly with your team. See changes instantly as multiple people draw and edit simultaneously.",
  },
  {
    icon: <FaPen />,
    title: "Intuitive Drawing Tools",
    desc: "From basic shapes to complex diagrams, create anything you imagine with natural tools.",
  },
  {
    icon: <FaImage />,
    title: "Image upload",
    desc: "Upload image from your system files and bring it in the canvas.",
  },
  {
    icon: <FaHandPointer />,
    title: "Drag and Move",
    desc: "From dragging any shape and moving anyhwere by hand cursor in the canvas comes all on your fingertips.",
  },
  {
    icon: <FaShareAlt />,
    title: "Room code & Share",
    desc: "Share sharable link or join a shared drawing using room code to anyone with ease.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure & Private",
    desc: "Your data is encrypted and secure. Choose to keep your work private or share it with the world.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 sm:px-10 bg-[#0E0E17]">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-16 leading-snug">
        Powerful Features for{" "}
        <span className="relative text-[#1E40FF]">
          Creative Teams
          <span className="absolute inset-x-0 bottom-1 h-[5px] bg-gradient-to-r from-[#1E40FF]/60 to-[#4F7BFF]/60 rounded-full blur-sm opacity-60"></span>
        </span>
      </h2>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#1A1A28] p-6 rounded-2xl border border-[#2b2b3f] hover:border-[#1E40FF]/50 hover:shadow-[0_0_25px_rgba(30,64,255,0.25)] transition-all duration-300 ease-out flex flex-col items-start text-left min-h-[280px] sm:min-h-[300px] group"
          >
            <div className="text-[#1E40FF] text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#4F7BFF] transition-colors">
              {f.title}
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
