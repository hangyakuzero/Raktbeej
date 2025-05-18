"use client"; // Next.js 13+ client component
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

async function fetchPaperDetails(id: string) {
  try {
    const response = await fetch(`/api/papers/${id}`);
    if (!response.ok) throw new Error("Failed to fetch paper details");
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
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
  const pathname = usePathname(); // e.g., "/papers/123"
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("5");
  const [donationMessage, setDonationMessage] = useState<string | null>(null);
  const [isDonating, setIsDonating] = useState(false);

  // Extract ID from pathname
  const paperId = pathname?.split("/").pop() || "";

  useEffect(() => {
    if (!paperId) {
      setError("Invalid paper ID");
      setLoading(false);
      return;
    }

    fetchPaperDetails(paperId).then((data) => {
      if (data) {
        setPaper(data);
        setError(null);
      } else {
        setError("Could not load paper details");
      }
      setLoading(false);
    });
  }, [paperId]);

  const handleDonate = async () => {
    if (parseFloat(donationAmount) <= 0) {
      setDonationMessage("Please enter a valid donation amount.");
      return;
    }

    setIsDonating(true);
    setDonationMessage(null);
    // --- Placeholder for actual donation logic ---
    console.log(
      `Attempting to donate ${donationAmount} to author wallet: ${paper.authorWallet}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setDonationMessage(
      `Thank you for your donation of $${donationAmount} to ${paper.authorName}! (This is a simulation)`,
    );
    setIsDonating(false);
    // --- End of placeholder ---
  };

  if (loading) return <p className="py-4 px-6">Loading paper details...</p>;
  if (error) return <p className="py-4 px-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="bg-emerald-400 py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/papers"
            className="btn btn-ghost btn-sm flex items-center gap-2"
          >
            <ArrowLeftIcon />
            Back to Papers
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PDF Viewer Area */}
        <div className="lg:col-span-2 bg-base-200 rounded-lg shadow-lg overflow-hidden">
          <object
            data={paper?.link}
            type="application/pdf"
            height="600px"
            width="100%"
          >
            <div className="p-6 text-center">
              <p className="text-warning-content mb-4">
                PDF preview is not available in your browser.
              </p>
              {paper?.link && (
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Download PDF
                </a>
              )}
            </div>
          </object>
        </div>

        {/* Paper Details and Donate Section */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-base-200 rounded-lg shadow-md p-6">
            <h1 className="text-2xl text-slate-200 font-bold text-primary mb-2">
              {paper?.title}
            </h1>
            <p className="text-sm text-base-content/70 mb-1">
              <strong>Topic:</strong> {paper?.topic}
            </p>
            <p className="text-sm text-base-content/70">
              <strong>Author:</strong> {paper?.authorName || "Unknown"}
            </p>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg text-secondary">
                Support Author
              </h2>

              <div className="form-control w-full">
                <label className="label" htmlFor="donationAmount">
                  <span className="label-text">Amount (POL)</span>
                </label>
                <div className="join">
                  <button className="btn join-item rounded-l-full pointer-events-none">
                    POL
                  </button>
                  <input
                    type="number"
                    id="donationAmount"
                    placeholder="5"
                    className="input input-bordered join-item w-full"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    step="1"
                    disabled={isDonating}
                  />
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  className={`btn btn-accent ${isDonating ? "loading" : ""}`}
                  onClick={handleDonate}
                  disabled={isDonating}
                >
                  <CreditCardIcon /> Donate
                </button>
              </div>
              {donationMessage && (
                <div
                  className={`mt-2 p-2 rounded-md text-sm ${
                    donationMessage.includes("failed") ||
                    donationMessage.includes("not available")
                      ? "bg-error/20 text-error-content"
                      : "bg-success/20 text-success-content"
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
