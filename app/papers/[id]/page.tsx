"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import { ethers } from "ethers";
import { Jersey_10 } from "next/font/google";
const jersey10 = Jersey_10({ subsets: ["latin"], weight: "400" });

const PDFViewer = dynamic(() => import('../../comps/PDFVIEWER'), { ssr: false });

// Add global type for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}



const CONTRACT_ADDRESS = "0xa7Ac4c614B8c00e1892DDB141D8524e0828418e1"; // e.g., "0x123..."
const POLYGON_AMOY_CHAIN_ID = "0x13882";
const CONTRACT_ABI = [
  // Paste your contract's ABI here. For OpenDonationSplitter, it would be:
  {
    inputs: [
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "percentages",
        type: "uint256[]",
      },
    ],
    name: "donateAndSplit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

];
// --- End of Smart Contract Details ---

// Define types for data structures
interface Paper {
  id: string;
  title: string;
  link: string;
  topic: string;
  authorName: string | null;
  authorWallet: string | null; // Primary author's wallet, might be used if no splits

}

interface RoyaltySplit {
  wallet_address: string;
  percentage: number; // e.g., 20 for 20%
}

async function fetchPaperDetails(id: string): Promise<Paper | null> {
  try {
    const response = await fetch(`/api/papers/${id}`); // Assuming this API returns the Paper structure
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch paper details");
    }
    return await response.json();
  } catch (e) {
    console.error("Error in fetchPaperDetails:", e);
    return null;
  }
}

async function fetchRoyaltySplits(id: string): Promise<RoyaltySplit[]> {
  try {
    const response = await fetch(`/api/papers/${id}/royaltysplits`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch royalty splits");
    }
    return await response.json();
  } catch (e) {
    console.error("Error in fetchRoyaltySplits:", e);
    return []; // Return empty array on error to prevent crashes
  }
}



function CreditCardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 mr-2"
    >
      <path d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      <path d="M10.875 9.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" />
      <path d="M13.125 7.5a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0ZM14.25 9a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0V9Z" />
    </svg>
  );
}

export default function Read() {
  const pathname = usePathname();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("5"); // Assuming POL means Polygon (POL)
  const [donationMessage, setDonationMessage] = useState<string | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  const paperId = pathname?.split("/").pop() || "";

  useEffect(() => {
    if (!paperId) {
      setError("Invalid paper ID in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchPaperDetails(paperId).then((data) => {
      if (data) {
        setPaper(data);
        setError(null);
      } else {
        setPaper(null); // Ensure paper is null if fetch fails
        setError(
          "Could not load paper details. The paper might not exist or there was a network issue.",
        );
      }
      setLoading(false);
    });
  }, [paperId]);

  const handleDonate = async () => {
    if (!paper || !paperId) {
      setDonationMessage("Paper details not loaded.");
      return;
    }

    const amountToDonate = parseFloat(donationAmount);
    if (isNaN(amountToDonate) || amountToDonate <= 0) {
      setDonationMessage("Please enter a valid positive donation amount.");
      return;
    }

    setIsDonating(true);
    setDonationMessage("Preparing donation...");

    try {
      // 1. Check for MetaMask (or other EIP-1193 provider)
   
      if (!window.ethereum) {
        setDonationMessage(
          "MetaMask (or another Web3 wallet) is not installed. Please install it to donate.",
        );
        setIsDonating(false);
        return;
      }

      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (currentChainId !== POLYGON_AMOY_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: POLYGON_AMOY_CHAIN_ID }],
          });
        } catch (switchError) {
          // If the network is not added to MetaMask, attempt to add it
          if (typeof switchError === 'object' && switchError && 'code' in switchError && switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: POLYGON_AMOY_CHAIN_ID,
                    chainName: "Polygon Amoy",
                    rpcUrls: ["https://rpc-amoy.polygon.technology"],
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["www.oklink.com/amoy"],
                  },
                ],
              });
            } catch  {
              setDonationMessage("Failed to add Polygon Amoy network.");
              setIsDonating(false);
              return;
            }
          } else {
            setDonationMessage(
              "Please switch to the Polygon Amoy network in your wallet.",
            );
            setIsDonating(false);
            return;
          }
        }
      }

      // 2. Connect to the wallet and get the signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setDonationMessage(
        `Wallet connected: ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`,
      );

      // 3. Fetch royalty splits
      setDonationMessage("Fetching royalty splits...");
      const splits = await fetchRoyaltySplits(paperId);
      console.log(splits);
      let recipients: string[] = [];
      let percentagesInBasisPoints: ethers.BigNumberish[] = []; // Use BigNumberish for contract

      if (splits && splits.length > 0) {
        recipients = splits.map((split) => split.wallet_address);
        // Convert percentages (e.g., 20 for 20%) to basis points (2000 for 20%)
        // This line correctly converts database percentage (e.g., 20) to basis points (20 * 100 = 2000)
        percentagesInBasisPoints = splits.map((split) =>
          BigInt(split.percentage * 100),
        );
        console.log(percentagesInBasisPoints);
        // REMOVED: Frontend validation for total percentage sum
        // const totalPercentageForContract = percentagesInBasisPoints.reduce((sum, p) => sum + BigInt(p.toString()), BigInt(0));
        // if (totalPercentageForContract !== BigInt(10000)) {
        //     setDonationMessage(`Error: Royalty split percentages do not sum to 100%. Sum is ${Number(totalPercentageForContract) / 100}%. Please contact support.`);
        //     setIsDonating(false);
        //     return;
        // }
      } else if (paper.authorWallet) {
        // If no splits defined, assume 100% to the primary author if their wallet is available
        setDonationMessage(
          "No specific royalty splits found. Assuming 100% to primary author.",
        );
        recipients = [paper.authorWallet];
        percentagesInBasisPoints = [BigInt(10000)]; // 10000 basis points = 100%
      } else {
        setDonationMessage(
          "No royalty recipients configured for this paper and primary author wallet is missing.",
        );
        setIsDonating(false);
        return;
      }

      // Check if recipients array is empty after processing splits
      if (recipients.length === 0) {
        setDonationMessage("No valid recipients found for the donation.");
        setIsDonating(false);
        return;
      }

      setDonationMessage(
        `Recipients: ${recipients.join(", ")}. Preparing transaction...`,
      );

      // 4. Instantiate the contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      // 5. Call the donateAndSplit function
      // Convert donationAmount (string, e.g., "5" POL/MATIC) to Wei (BigNumber)
      const amountInWei = ethers.parseUnits(donationAmount, 18); // Assuming 18 decimals for POL/MATIC
      console.log(amountInWei);
      setDonationMessage("Please confirm the transaction in your wallet...");

      const estimatedGas = await contract.donateAndSplit.estimateGas(
        recipients,
        percentagesInBasisPoints,
        { value: amountInWei },
      );
      console.log("Estimated gas:", estimatedGas.toString());
      const additional = (estimatedGas * BigInt(40)) / BigInt(100);
      const gasLimit = estimatedGas + additional;
      const tx = await contract.donateAndSplit(
        recipients,
        percentagesInBasisPoints,
        {
          value: amountInWei,
          gasLimit: gasLimit,
          //gasPrice: gasLimit,
        },
      );

      setDonationMessage(
        `Transaction sent! Hash: ${tx.hash.substring(0, 10)}... Waiting for confirmation...`,
      );
      await tx.wait(); // Wait for the transaction to be mined

      setDonationMessage(
        `Donation of ${donationAmount} MATIC successful! Thank you! ${tx.hash}`,
      ); // Changed POL to MATIC for consistency
      // Optionally reset donation amount or give further user feedback
      // setDonationAmount("5");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Donation failed:", err);
        const metaMaskError = err as { code?: number };
        if (metaMaskError.code === 4001) {
        // User rejected transaction
        setDonationMessage("Transaction rejected in wallet.");
      } else if (err.message.includes("insufficient funds")) {
        setDonationMessage(
          "Donation failed: Insufficient funds for transaction.",
        );
      } else {
        // Try to get a more specific error from the contract if available
        const contractErrorReason = (err as any).data?.message || (err as any).reason;
        setDonationMessage(
          `Donation failed: ${contractErrorReason || err.message || "An unknown error occurred."}`,
        );
      }}
    } finally {
      setIsDonating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className={"ml-4 text-2xl " + jersey10.className}>Loading paper details...</p>
      </div>
    );

  if (error || !paper)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6">
        <h2 className="text-2xl font-semibold text-error mb-4">
          Error Loading Paper
        </h2>
        <p className="text-base-content/80 mb-6 text-center">
          {error || "The paper data could not be loaded."}
        </p>
 
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 text-base-content">


      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-base-200 rounded-lg shadow-lg overflow-hidden">
          {paper.link ? (
            <PDFViewer fileUrl={paper.link} />
          ) : (
            <div className="h-[600px] flex items-center justify-center text-center p-6">
              <p className="text-xl text-base-content/70">
                PDF link is not available for this paper.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-6">
          {" "}
          {/* Increased space-y */}
          <div className="bg-base-200 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-slate-200 mb-2 break-words">
              {" "}
              {/* text-slate-200 removed, using theme's primary */}
              {paper.title}
            </h1>
            <p className="text-sm text-base-content/80 mb-1">
              <strong>Topic:</strong> {paper.topic || "N/A"}
            </p>
            <p className="text-sm text-base-content/80">
              <strong>Author:</strong> {paper.authorName || "Unknown"}
            </p>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg text-secondary">
                Support Author(s)
              </h2>
              <p className="text-xs text-base-content/60 mb-1">
                Donate using Polygon (POL).
              </p>

              <div className="form-control w-full">
                <label className="label" htmlFor="donationAmount">
                  <span className="label-text">Amount (MATIC)</span>
                </label>
                <div className="join">
                  <button className="btn join-item rounded-l-full pointer-events-none !bg-primary-focus !text-primary-content">
                    POL
                  </button>
                  <input
                    type="number"
                    id="donationAmount"
                    placeholder="5"
                    className="input input-bordered join-item w-full"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="0.01" // Minimum donation amount
                    step="0.01"
                    disabled={isDonating}
                  />
                </div>
              </div>
              <div className="card-actions justify-start mt-4">
                {" "}
                {/* Changed to justify-start */}
                <button
                  className={`btn btn-accent w-full sm:w-auto ${isDonating ? "loading" : ""}`} // Responsive width
                  onClick={handleDonate}
                  disabled={isDonating}
                >
                  <CreditCardIcon />{" "}
                  {isDonating ? "Processing..." : "Donate Now"}
                </button>
              </div>
              {donationMessage && (
                <div
                  className={`mt-3 p-3 text-slate-200 rounded-md text-sm shadow ${
                    donationMessage.includes("failed") ||
                    donationMessage.includes("not available") ||
                    donationMessage.includes("Error:") ||
                    donationMessage.includes("rejected")
                      ? "bg-error/20 text-error-content border border-error overflow-auto"
                      : donationMessage.includes("successful") ||
                          donationMessage.includes("Thank you")
                        ? "bg-success/20 text-slate-200 border border-success overflow-auto"
                        : "bg-info/20 text-slate-200 border border-info" // For intermediate messages
                  }`}
                >
                  {donationMessage}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
