import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import WhyChoose from "../components/WhyChoose";
import ReadyToStart from "../components/ReadyToStart";
import Footer from "../components/Footer";

export default async function Home() {
  const session = await getServerSession(authOption);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#1a1a33] to-[#1e1b4b] text-white">
      <Navigation />
      <Hero />
      <Features />
      <WhyChoose />
      <ReadyToStart />
      <Footer />
    </div>
  );
}
