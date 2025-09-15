"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const scrollToVideo = () => {
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <section className="flex flex-col items-center text-center py-20 px-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
        Collaborate & Create <br />
        <span className="text-purple-400">Visual Ideas</span>
      </h1>

      <p className="mt-6 max-w-2xl text-gray-300 text-lg sm:text-xl">
        FlowDraw is the collaborative drawing tool that brings teams together.
        Sketch, brainstorm, and visualize ideas in real-time with your team.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/api/auth/signin"
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-lg px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Start Drawing Free
        </Link>
        <button
          onClick={scrollToVideo}
          className="bg-black text-lg px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          Watch Full Demo
        </button>
      </div>

      <div
        ref={videoContainerRef}
        className="mt-16 w-full max-w-4xl bg-[#1f1f35] rounded-xl shadow-lg overflow-hidden"
      >
        <div className="aspect-video relative group">
          {!videoLoaded && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          )}

          {videoLoaded && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onPlay={handlePlay}
              onPause={handlePause}
              onLoadStart={() => console.log("Video loading started")}
              onCanPlay={() => console.log("Video ready to play")}
            >
              <source src="/preview-draw.mp4" type="video/mp4" />
              <source src="/preview-draw.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}

          {videoLoaded && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={togglePlayPause}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-colors duration-200 flex items-center justify-center"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
