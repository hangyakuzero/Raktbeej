import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./comps/Navbar";
import "./globals.css";

import {
  ClerkProvider,

  SignedOut,

} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raktbeej",
  description: "A De-sci project",
    icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100`}
        >
          <header>
            <div className="text-slate-50">
             <Navbar />
            <SignedOut>
              {/*  <SignInButton />
              <SignUpButton /> */}
            </SignedOut>
    
  
            </div>
          </header>
<div className="text-slate-50">
          {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
