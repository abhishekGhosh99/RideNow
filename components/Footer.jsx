"use client";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: "Home", href: "#" },
      { label: "Cars", href: "#cars" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
    Support: [
      { label: "FAQ", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Insurance", href: "#" },
      { label: "Terms", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Disclaimer", href: "#" },
    ],
  };

  const socialIcons = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-slate-950/80 border-t border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative px-3 py-1.5 bg-slate-950 rounded-lg">
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    RideNow
                  </span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium car rental service offering affordable prices and seamless
              booking experience.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/50 text-slate-400 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 hover:text-white transition-all duration-300 border border-cyan-500/10 hover:border-cyan-500/30"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-cyan-500/10">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-slate-400 text-sm">Phone</p>
              <a
                href="tel:+1234567890"
                className="text-white hover:text-cyan-400 transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <a
                href="mailto:support@ridenow.com"
                className="text-white hover:text-purple-400 transition-colors"
              >
                support@ridenow.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-slate-400 text-sm">Address</p>
              <p className="text-white">123 Car Street, Motor City</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {currentYear} RideNow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
            >
              Accessibility
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-cyan-400 text-sm transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
