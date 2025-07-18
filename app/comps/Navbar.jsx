import React from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], weight: "900" });


export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>About</a>
            </li>
            <li>
              <a href="/papers">Papers</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
        <a className={`btn btn-ghost  text-2xl ${inter.className}`} href="/">
          RAKTBEEJ 🩸
        </a>
      </div>
      <div className="navbar-center m-3 px-6 hidden lg:flex">
        <ul className={"menu font-bold menu-horizontal " }>
          <li>
            <a href="/About">About</a>
          </li>
          <li>
            <a href="/papers">Papers</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <SignedIn>
          <UserButton />
          <Link href="/dashboard" className="text-lg px-4">
            Dashboard
          </Link>
                  <Link href="/uploadpage" className="btn bg-red-500 hover:bg-[#F9564F] transition-all delay-75 ease-in-out rounded-lg">
          Upload
        </Link>
        </SignedIn>
           <SignedOut>
      <div className="btn bg-blue-500 hover:bg-blue-600 transition-all delay-75 ease-in-out rounded-lg">  
       <SignInButton />

     </div>  
<span className="btn bg-slate-50 hover:bg-zinc-950 hover:text-slate-50 transition-all delay-75 ease-in-out text-black rounded-lg ml-2">
           <SignUpButton />
</span>
      
          </SignedOut>

 

      </div>
    </div>
  );
}
