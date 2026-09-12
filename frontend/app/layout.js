import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "RideNow — Premium Car Rental",
  description: "Find and book premium cars for every journey with RideNow.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LenisProvider>
            <Navbar />

            <main>{children}</main>

            <Footer />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
