import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Directory",
  description: "A directory of local businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        <Toaster position="top-center" />
        <footer className="py-4 text-center text-gray-600">
          Made with ❤️ in India By{" "}
          <span className="text-blue-500">Krushnasinh Jadeja</span>
        </footer>
      </body>
    </html>
  );
}
