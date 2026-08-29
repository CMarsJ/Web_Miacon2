import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Miacon 2.0 - Plataforma Interactiva de Control",
  description: "Aprende y experimenta con teoría de control automático, simulaciones interactivas y laboratorios prácticos con Miacon 2.0.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 bg-radial-gradient bg-grid-pattern selection:bg-indigo-500 selection:text-white`}
      >
        <Navbar />
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
