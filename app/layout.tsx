import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdBar } from "@/components/AdBar";
import { CartProvider } from "@/components/CartProvider";

const CartDrawer = dynamic(() => import("@/components/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot").then((m) => m.Chatbot), { ssr: false });

export const metadata: Metadata = {
  title: "GameHubSpot — Games, Accessories, and the Dhaka Night Vibe",
  description:
    "GameHubSpot is a neon-green marketplace for PC, iOS and Android games plus accessories, built by Webmernix in Dhaka, Bangladesh.",
  keywords: ["games", "PC games", "iOS games", "Android games", "accessories", "Dhaka", "Webmernix"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AdBar />
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
