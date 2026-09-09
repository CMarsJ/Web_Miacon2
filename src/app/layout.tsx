import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Miacon 2.0 - Instrumento de Control",
  description: "Plataforma de aprendizaje y experimentación de control en lazo cerrado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans bg-surface text-slate-800 selection:bg-blue-600 selection:text-white min-h-screen`}
      >
        <Navbar />
        <main className="relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
