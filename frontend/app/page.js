import Hero from "@/components/Hero";
import CarSearch from "@/components/CarSearch";
import FeaturedFleet from "@/components/FeaturedFleet";
import WhyRideNow from "@/components/WhyRideNow";
import HowItWorks from "@/components/HowItWorks";
import TrustStats from "@/components/TrustStats";
import FinalCTA from "@/components/FinalCTA";

const Home = () => {
  return (
    <main className="bg-[#09090B] text-[#F4F4F5]">
      {/* Hero */}
      <Hero />

      {/* Vehicle Search */}
      <CarSearch />

      {/* Why RideNow */}
      <WhyRideNow />

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Fleet */}
      <FeaturedFleet />

      {/* Trust / Stats */}
      <TrustStats />

      {/* Final CTA */}
      <FinalCTA />
    </main>
  );
};

export default Home;
