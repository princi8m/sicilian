import { Abril_Fatface, DM_Sans, Newsreader, Space_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abril",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Sicilian Film Awards",
  description: "An international competition for short and feature cinema, staged each spring in Palermo, Sicily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${abrilFatface.variable} ${dmSans.variable} ${newsreader.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
