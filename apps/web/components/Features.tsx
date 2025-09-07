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
    <section id="features" className="py-20 px-6 sm:px-10">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16">
        Powerful Features for{" "}
        <span className="text-purple-400">Creative Teams</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#1f1f35] p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition flex flex-col items-start text-left min-h-[280px] sm:min-h-[300px]"
          >
            <div className="text-purple-400 text-3xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-base leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
