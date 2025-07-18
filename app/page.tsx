import Head from "next/head";
import Link from "next/link";

import { Jersey_25 } from "next/font/google";
import { SignedIn, SignedOut } from "@clerk/nextjs";



const jersey25 = Jersey_25({ subsets: ["latin"], weight: "400" });


export default function Home() {
  return (
    <div className="text-2xl text-slate-50 ">
      <Head>
        <title>Raktbeej</title>
        <meta property="og:title" content="Raktbeej" key="title" />
      </Head>
     
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="mascot.png"
            className="max-w-sm rounded-lg shadow-2xl h-[30rem] text-shadow-2xl hover:border-pink-500 border-cyan-500 border-2"
          />
          <div>
            <h1 className="text-5xl font-bold">
              Welcome To{" "}
              <span className="hover:underline decoration-1 hover:decoration-pink-700 bg-gradient-to-r from-red-400 via-red-600 to-red-700 bg-clip-text text-transparent">
                Raktbeej
              </span>
            </h1>
            <h2 className={`text-3xl font-bold pl-1  ${jersey25.className}`}>
              Shape the Future of Decentralized Science
            </h2>
            <p className={`py-6 `}>

              Empower innovation through incentivized research and seamless
              collaboration. Predefine royalty splits on each paper—donations
              are automatically distributed to collaborators’ wallets, ensuring
              fair, transparent rewards.{" "}
            
            </p>
            <div className="group inline-block relative">
              <SignedOut>
              <Link href="/sign-up">
                <button className="btn bg-gradient-to-r from-amber-400 via-orange-200 to-amber-500  rounded-lg  shadow-2xl text-black h-13 w-30 hover:border-black hover:border-2">
                  Get Started
                </button>
              </Link>
                            <span className="absolute inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-400 to-cyan-500 h-[2px] w-3/4 "></span>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-400 to-cyan-500 h-[2px] w-3/4  shadow-2xl"></span>
              </SignedOut>

                            <SignedIn>
              <Link href="/papers">
                <button className="btn  rounded-lg border-cyan-300 bg-emerald-300  shadow-2xl text-black h-13 w-30 hover:border-black hover:border-2">
                  Explore Papers
                </button>
              </Link>
              </SignedIn>




            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
