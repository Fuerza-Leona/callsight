import type { Metadata } from "next";
import {  Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: 'variable',
  variable: '--font-inter',
});
const outfit = Outfit({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "CallSight - Insights valiosos de tus reuniones",
  description: "otencia tu relación con clientes con análisis inteligentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <body
        className="font-outfit"
      >
        {children}
      </body>
    </html>
  );
}
