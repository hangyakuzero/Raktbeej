"use client";

import { useState, useRef } from "react"; // Added useRef for file input reset
import { useUser } from "@clerk/nextjs";


// A simple X icon for the remove button (replace with an SVG icon if you have an icon library)
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Home() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null); // For resetting file input

  const [royaltySplits, setRoyaltySplits] = useState<
    { wallet_address: string; percentage: number  }[]
  >([{ wallet_address: "", percentage: 0 }]);
  
  interface RoyaltySplit {
  wallet_address: string;
  percentage: number;
}

  const resetFormFields = () => {
    setFile(null);
    setTitle("");
    setTopic("");
    setRoyaltySplits([{ wallet_address: "", percentage: 0 }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const uploadFile = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed. Please select a valid PDF.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for the document.");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a topic for the document.");
      return;
    }
    const invalidSplitIndex = royaltySplits.findIndex(
      (split) =>
        !split.wallet_address.trim() ||
        split.percentage <= 0 ||
        split.percentage > 100,
    );
    if (invalidSplitIndex !== -1) {
      setError(
        `Please ensure all royalty splits (Author ${invalidSplitIndex + 1}) have a valid wallet address and a percentage between 1 and 100.`,
      );
      return;
    }
    // Optional: Validate sum of percentages
    const totalPercentage = royaltySplits.reduce(
      (sum, split) => sum + split.percentage,
      0,
    );
    if (totalPercentage !== 100 && royaltySplits.length > 0) {
      setError(
        `The sum of royalty percentages must be exactly 100%. Current sum is ${totalPercentage}%.`,
      );
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.set("file", file);
      data.set("title", title);
      data.set("topic", topic);
      data.set("email", user?.primaryEmailAddress?.emailAddress || "");
      data.set("royalty_split_count", royaltySplits.length.toString());
      royaltySplits.forEach((split, index) => {
        data.set(`royalty_split_wallet_${index}`, split.wallet_address);
        data.set(
          `royalty_split_percentage_${index}`,
          split.percentage.toString(),
        );
      });

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const responseData = await uploadRequest.json();

      if (!uploadRequest.ok) {
        throw new Error(
          responseData.error || responseData.details || "File upload failed",
        );
      }

      setUrl(responseData.url);
      setSuccessMessage("File uploaded successfully! You can view it below.");
      resetFormFields(); // Reset form on success
    } catch (e: any) {
      setError("Trouble uploading file: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUrl(""); // Clear previous uploaded URL/preview
      setSuccessMessage(null);
      setError(null);
    }
  };

  const handleRoyaltyChange = (
    index: number,
    field: "wallet_address" | "percentage",
    value: string | number,
  ) => {
    const newRoyaltySplits = [...royaltySplits];
    const percentageValue = field === "percentage" ? Number(value) : value;

    // Basic validation for percentage input
    if (field === "percentage") {
      if (Number(percentageValue) < 0) newRoyaltySplits[index][field] = 0;
      else if (Number(percentageValue) > 100)
        newRoyaltySplits[index][field] = 100;
      else newRoyaltySplits[index][field] = Number(percentageValue);
    } else {
      newRoyaltySplits[index][field] = percentageValue;
    }
    setRoyaltySplits(newRoyaltySplits);
  };

  const addRoyaltySplit = () => {
    setRoyaltySplits([...royaltySplits, { wallet_address: "", percentage: 0 }]);
  };

  const removeRoyaltySplit = (index: number) => {
    if (royaltySplits.length <= 1) {
      setError(
        "At least one author for royalty split must be specified. You can edit the existing one.",
      );
      return;
    }
    const newRoyaltySplits = royaltySplits.filter((_, i) => i !== index);
    setRoyaltySplits(newRoyaltySplits);
  };

  const previewFile = file && !url ? URL.createObjectURL(file) : "";

  return (
    <div className="bg-base-100 text-base-content min-h-screen py-8 sm:py-12 px-4">
      <div className="fixed flex w-full  top-0">

      </div>
      <main className="w-full max-w-2xl mx-auto">
        <div className="bg-base-200 shadow-xl rounded-lg p-6 sm:p-10 space-y-6">
          <h1 className="text-3xl font-bold text-center text-slate-200 mb-8">
            Upload Your Document
          </h1>

          {/* Error Message Display */}
          {error && (
            <div role="alert" className="alert alert-error shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Display */}
          {successMessage &&
            !error && ( // Show success only if no new error
              <div role="alert" className="alert alert-success shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

          {/* File Input */}
          <div className="form-control w-full">
            <label htmlFor="file-upload" className="label">
              <span className="label-text">Choose PDF Document</span>
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={handleFileChange}
              accept="application/pdf"
              disabled={uploading}
            />
            {file && (
              <p className="text-sm mt-1 text-base-content/70">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Title Input */}
          <div className="form-control w-full">
            <label htmlFor="title" className="label">
              <span className="label-text">Document Title</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Groundbreaking Research on AI Ethics"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Topic Input */}
          <div className="form-control w-full">
            <label htmlFor="topic" className="label">
              <span className="label-text">Main Topic / Keywords</span>
            </label>
            <input
              id="topic"
              type="text"
              placeholder="e.g., Artificial Intelligence, Machine Learning"
              className="input input-bordered w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Royalty Splits Section */}
          <div className="space-y-4 pt-4 border-t border-base-300">
            <h2 className="text-xl font-semibold text-secondary">
              Royalty Splits
            </h2>
            {royaltySplits.map((split, index) => (
              <div
                key={index}
                className="p-3 bg-base-100 rounded-md shadow space-y-3"
              >
                <p className="font-medium text-sm">Author {index + 1}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="form-control flex-1">
                    <label htmlFor={`wallet-${index}`} className="label pt-0">
                      <span className="label-text text-xs">
                        Author Wallet Address
                      </span>
                    </label>
                    <input
                      id={`wallet-${index}`}
                      type="text"
                      placeholder="0x..."
                      className="input input-sm input-bordered w-full"
                      value={split.wallet_address}
                      onChange={(e) =>
                        handleRoyaltyChange(
                          index,
                          "wallet_address",
                          e.target.value,
                        )
                      }
                      disabled={uploading}
                    />
                  </div>
                  <div className="form-control sm:w-1/3">
                    <label
                      htmlFor={`percentage-${index}`}
                      className="label pt-0"
                    >
                      <span className="label-text text-xs">Percentage (%)</span>
                    </label>
                    <input
                      id={`percentage-${index}`}
                      type="number"
                      placeholder="e.g., 50"
                      min="1"
                      max="100"
                      className="input input-sm input-bordered w-full"
                      value={split.percentage === 0 ? "" : split.percentage} // Show empty if 0 for better UX
                      onChange={(e) =>
                        handleRoyaltyChange(index, "percentage", e.target.value)
                      }
                      disabled={uploading}
                    />
                  </div>
                  {royaltySplits.length > 1 && ( // Show remove button only if more than one split
                    <button
                      type="button"
                      className="btn btn-sm btn-error btn-outline self-end sm:self-center mt-2 sm:mt-0"
                      onClick={() => removeRoyaltySplit(index)}
                      disabled={uploading}
                      aria-label={`Remove Author ${index + 1}`}
                    >
                      <XIcon /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-outline w-full sm:w-auto"
              onClick={addRoyaltySplit}
              disabled={uploading}
            >
              + Add Another Author
            </button>
            {royaltySplits.length > 0 && (
              <p className="text-sm text-info mt-2">
                Total Percentage Allocated:{" "}
                {royaltySplits.reduce(
                  (sum, split) => sum + split.percentage,
                  0,
                )}
                %
              </p>
            )}
          </div>

          {/* Upload Button */}
          <div className="pt-6 border-t border-base-300">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={uploading || !file}
              onClick={uploadFile}
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </button>
          </div>

          {/* File Preview (Before successful upload) */}
          {previewFile && !successMessage && (
            <div className="mt-8 p-4 border border-dashed border-base-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-accent">
                File Preview:
              </h3>
              <object
                data={previewFile}
                type="application/pdf"
                height="450px"
                width="100%"
                className="rounded"
              >
                <p className="text-error-content">
                  PDF preview is not available in your browser. You can still
                  upload the file.
                </p>
              </object>
            </div>
          )}

          {/* Uploaded File Display (After successful upload) */}
          {url && successMessage && (
            <div className="mt-8 p-4 border border-success rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-success-content">
                Uploaded File:
              </h3>
              <object
                data={url}
                type="application/pdf"
                height="450px"
                width="100%"
                className="rounded"
              >
                <p className="text-error-content">
                  PDF preview is not available. You can access your file
                  directly{" "}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    here
                  </a>
                  .
                </p>
              </object>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
