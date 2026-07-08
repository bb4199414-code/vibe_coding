import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChatModal from "@/components/ChatModal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA Nexus AI | 2026 World Cup",
  description: "GenAI-enabled operations and experience hub for the FIFA World Cup 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <ChatModal />
      </body>
    </html>
  );
}
