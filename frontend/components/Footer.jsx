"use client";

import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: "Home", href: "/" },
      { label: "Our Cars", href: "/cars" },
      { label: "Pricing", href: "#pricing" },
      { label: "About Us", href: "#about" },
    ],
    Support: [
      { label: "Contact", href: "#contact" },
      { label: "FAQs", href: "#faq" },
      { label: "Insurance", href: "#insurance" },
      { label: "Help Center", href: "#help" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cancellation Policy", href: "#cancellation" },
      { label: "Disclaimer", href: "#disclaimer" },
    ],
  };

  const socialIcons = [
    {
      icon: Instagram,
      label: "Instagram",
      href: "#",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "#",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "#",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "#",
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#09090B]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="inline-flex items-center">
              <span className="text-xl font-semibold tracking-[-0.03em] text-white">
                RideNow
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
              Premium cars, simple booking, and a better way to get on the road.
              Find your next ride with RideNow.
            </p>

            {/* Social */}
            <div className="mt-7 flex items-center gap-2.5">
              {socialIcons.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111113] text-zinc-500 transition-all duration-200 hover:border-[#D4AF5A]/40 hover:bg-[#18181B] hover:text-[#D4AF5A]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            {Object.entries(footerLinks).map(([title, links], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 * (index + 1),
                }}
              >
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                  {title}
                </h3>

                <ul className="mt-5 space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
            className="lg:col-span-3"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
              Get in touch
            </h3>

            <div className="mt-5 space-y-5">
              {/* Phone */}
              <a
                href="tel:+911234567890"
                className="group flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111113]">
                  <Phone className="h-3.5 w-3.5 text-[#D4AF5A]" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-zinc-600">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-zinc-400 transition-colors group-hover:text-white">
                    +91 12345 67890
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@ridenow.com"
                className="group flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111113]">
                  <Mail className="h-3.5 w-3.5 text-[#D4AF5A]" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-zinc-600">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-zinc-400 transition-colors group-hover:text-white">
                    support@ridenow.com
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111113]">
                  <MapPin className="h-3.5 w-3.5 text-[#D4AF5A]" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-zinc-600">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">Delhi, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/[0.06]" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-600">
            © {currentYear} RideNow. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="#privacy"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
            >
              Privacy
            </Link>

            <Link
              href="#terms"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
            >
              Terms
            </Link>

            <Link
              href="#accessibility"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
            >
              Accessibility
            </Link>

            <Link
              href="/cars"
              className="group flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-[#D4AF5A]"
            >
              Browse cars
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
