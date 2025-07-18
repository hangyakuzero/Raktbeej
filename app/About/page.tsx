import React from "react";
import Link from "next/link";
import { Jersey_10 } from "next/font/google";
import { Inter } from "next/font/google";

const jersey10 = Jersey_10({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: "500" });

function HOME() {
  return (
    <div className="text-slate-100 text-lg justify-center items-center">
      <div
        className="text-center h-full pb-16 px-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "8px 8px",
          backgroundRepeat: "repeat",
        }}
      >
        <h1 className={`text-5xl text-green-400 pt-5 ${jersey10.className}`}>
          What Is This All About?
        </h1>
        <p
          className={`text-xl pt-5 text-center mx-auto max-w-3xl ${inter.className}`}
        >
          This is a unique project that lets authors upload papers and define
          royalty splits for each author. Whenever an organization or an
          individual donates to the project, the money is automatically split
          among the authors based on those splits — and sent directly to their
          wallets via the blockchain.
        </p>

        <h1
          className={`text-5xl font-extrabold pt-5 text-yellow-300 ${jersey10.className}`}
        >
          The Need
        </h1>
        <div className="space-y-6 pt-5 text-center mx-auto max-w-3xl">
          <p className={`text-xl ${inter.className}`}>
            In the world of academia, authors often struggle to get fair
            compensation for their work. Traditional publishing models can be
            opaque and unfair, leaving many without adequate recognition or
            financial support. This project aims to change that by leveraging
            blockchain for transparent, fair royalty distribution.
          </p>

          <p className={`text-xl ${inter.className}`}>
            Pay-to-publish journals offer no incentives for the authors, despite
            the immense effort behind their research and writing. I dream of a
            future where research and science are open to all, and authors are
            fairly compensated for their contributions.
          </p>

          <p className={`text-xl ${inter.className}`}>
            Thanks to the power of blockchain and the concept of DeSci, we can
            now build a system where authors are incentivized to publish, and
            readers can access content freely.
          </p>

          <p className={`text-xl ${inter.className}`}>
            To learn more about the "Regen Nature" of crypto, read this:{" "}
            <Link
              href="https://greenpill.network/pdf/green-pill.pdf"
              target="_blank"
            >
              <u className="font-semibold text-green-300">The Green Pill</u>
            </Link>
          </p>
        </div>

        <h1
          className={`text-5xl text-red-400 font-extrabold pt-10 ${jersey10.className}`}
        >
          The Cool Tech Behind It
        </h1>
        <p
          className={`text-xl pt-5 text-center mx-auto max-w-3xl ${inter.className}`}
        >
          We use <Link href="https://pinata.cloud/"> <u className="">Pinata</u></Link> (which uses <Link href="https://ipfs.tech/"><u >IPFS</u></Link>) to store the papers. To avoid bloating
          the smart contract and ensure authors don’t need to pay gas fees
          upfront, paper metadata and royalty splits are stored in a <Link href="https://neon.com/"><u>Neon</u></Link>
          (PostgreSQL) database. Transactions are handled by a smart contract
          written in Solidity, currently deployed on the Polygon Amoy testnet.
        </p>

        <h1
          className={`text-5xl text-blue-400 font-extrabold pt-10 ${jersey10.className}`}
        >
          Further Enhancements?
        </h1>
        <p
          className={`text-xl pt-5 text-center mx-auto max-w-3xl ${inter.className}`}
        >
          The initial version of this project is just a proof of concept, built
          to attract grants or funding so I can properly deploy and scale it
          (I'm a broke college student in India, lol). In the next version, I
          plan on changing the design of the smart contract, which will
          basically have a mapping to store the balances of accounts on chain,
          which will reduce gas costs and allow the authors to add cited papers
          in their royalty splits without adding the wallet addresses of the
          cited authors manually, Of course this depends on whether the public
          goods and DeSci Community think this is a good project and whether i
          get a grant to build this, so I'm not holding my breath on it.
        </p>
      </div>
    </div>
  );
}

export default HOME;
