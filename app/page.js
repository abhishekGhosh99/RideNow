import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Hero />
      <Features />
      <Highlights />
      <Pricing />
      <Footer />
    </main>
  );
}
