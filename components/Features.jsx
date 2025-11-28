"use client";
import { Car, Zap, HeadphonesIcon } from "lucide-react";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Wide Car Selection",
      description:
        "Choose from economy to luxury models. Our diverse fleet caters to every need and budget.",
      icon: Car,
      gradient: "from-cyan-400 to-blue-400",
    },
    {
      id: 2,
      title: "Easy Online Booking",
      description:
        "Fast, seamless and paperless. Book your dream car in just a few clicks.",
      icon: Zap,
      gradient: "from-purple-400 to-pink-400",
    },
    {
      id: 3,
      title: "24/7 Customer Support",
      description:
        "We are always available. Get instant support whenever you need us.",
      icon: HeadphonesIcon,
      gradient: "from-orange-400 to-red-400",
    },
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="features"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 rounded-full px-4 py-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
              Why Choose RideNow
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            <span className="bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Premium Features, Affordable Prices
            </span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto text-balance font-medium">
            Experience the best in car rental with our carefully crafted
            features designed for your convenience.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="relative group">
                {/* Card background with gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/40 to-slate-900/60 rounded-2xl border border-cyan-400/20 group-hover:border-cyan-400/50 transition-colors duration-300 shadow-xl"></div>

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative p-8 flex flex-col h-full space-y-6">
                  {/* Icon container */}
                  <div className="inline-flex items-center justify-center w-16 h-16">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}
                    ></div>
                    <div
                      className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                    >
                      <Icon
                        className="w-8 h-8 text-slate-950"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>

                  <div
                    className={`h-1 w-12 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-20 transition-all duration-300`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
