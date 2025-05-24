import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./comps/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
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
            <SignedOut>
              {/*  <SignInButton />
              <SignUpButton /> */}
            </SignedOut>
            <SignedIn>
              {" "}
              <UserButton />{" "}
            </SignedIn>
          </header>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
