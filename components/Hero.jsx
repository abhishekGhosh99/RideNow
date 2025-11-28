"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-20"
      id="home"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900"></div>

        <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-orange-400/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80caff_1px,transparent_1px),linear-gradient(to_bottom,#80caff_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="absolute inset-0 bg-radial-gradient opacity-40 pointer-events-none"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8 order-last lg:order-first">
            <div className="inline-flex items-center gap-3 w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-full blur-md opacity-60"></div>
                <div className="relative w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"></div>
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent tracking-widest uppercase font-semibold">
                Future of Mobility
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-balance">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                Rent Your Dream Car in Minutes
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl text-balance font-medium">
              Affordable prices, easy booking, and premium cars at your
              fingertips. Experience the future of car rental today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/40 text-white font-semibold rounded-xl h-14 px-8 transition-all duration-300 group overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-2">
                  Book Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-500/40 text-white hover:bg-cyan-500/10 hover:border-cyan-400/70 font-semibold rounded-xl h-14 px-8 transition-all duration-300 backdrop-blur-sm bg-white/5 hover:text-white"
              >
                View Cars
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-slate-700/50">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  50K+
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Happy Customers
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  500+
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Premium Vehicles
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  24/7
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  Support Available
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center h-full order-first lg:order-last">
            <div className="relative w-full max-w-full mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-orange-400/15 rounded-3xl blur-2xl"></div>

              <div className="relative w-full h-auto">
                <img
                  src="/hero-img.png"
                  alt="Premium luxury car for rental"
                  className="w-full h-auto object-contain scale-125 md:scale-150"
                />
              </div>

              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-orange-400/30 to-cyan-500/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

              <div
                className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-3xl pointer-events-none animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
