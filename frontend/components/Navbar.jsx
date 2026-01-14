"use client";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const Navbar = ({
  showLinks = true,
  showBookButton = false,
  showBackButton = false,
  showLoginSignupButton = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dropdownRef = useRef(null);

  const isHomePage = pathname === "/";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Cars Highlights", href: "#highlights" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative px-3 py-1.5 bg-slate-950 rounded-lg">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      RideNow
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            {showLinks && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400 transition-all duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-4 w-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full group-hover:w-[calc(100%-32px)] transition-all duration-300"></span>
                  </a>
                ))}
              </div>
            )}

            {/* Right Action */}
            <div className="hidden md:flex items-center gap-4">
              {showBookButton && (
                <Link href="/booking">
                  <button className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500">
                    Book Now
                  </button>
                </Link>
              )}

              {showBackButton && (
                <button
                  onClick={() => router.back()}
                  className="flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              {showLoginSignupButton && isHomePage && (
                <Link href={isAuthenticated ? "/booking" : "/login"}>
                  <button className="flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500">
                    {isAuthenticated ? "Book Now" : "Login / Signup"}
                  </button>
                </Link>
              )}

              {/* User Avatar */}
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white"
                  >
                    <User size={20} />
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg">
                      <h1 className="text-slate-300 p-4 border-b-[0.5px] border-slate-500">
                        Hii, {user.firstName}
                      </h1>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-slate-800 rounded-b-lg rounded-bl-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            {showLinks && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-cyan-400 hover:bg-slate-800/50 transition-all"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/60 hover:text-cyan-400 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 pb-2 border-t border-cyan-500/20">
                <button className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-white text-lg font-semibold mb-4">
              Do you really want to logout?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
