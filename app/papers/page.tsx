"use client"; // For Next.js 13+ App Router, if you are using it.
// If using Pages Router, this line is not needed.

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head"; // For setting page title

// Define the structure of a paper object we expect from the API
interface Paper {
  id: number;
  title: string;
  link: string;
  topic: string;
  authorName: string | null; // Author name can be null if user is deleted and author_id is set to null
  authorId: number;
  authorWallet: string | null;
}

// Placeholder for an icon (e.g., from lucide-react or heroicons)
const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.509a.75.75 0 0 0 .5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533A9.707 9.707 0 0 0 18 21a9.735 9.735 0 0 0 3.25-.555.75.75 0 0 0 .5-.707V4.262a. ৭৫.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533Z" />
  </svg>
);
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

const UserCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mr-1 opacity-70"
  >
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438Z M15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPapers() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/papers");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch papers");
        }
        const data: Paper[] = await response.json();
        setPapers(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching papers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPapers();
  }, []);

  return (
    <>
      <Head>
        <title>Research Papers | SciPub</title>
        <meta
          name="description"
          content="Browse through a collection of research papers."
        />
      </Head>
      <div className="bg-base-100 text-base-content min-h-screen  sm:pb-4 top-0 pb-3">
        <div className="bg-emerald-400 py-3 px-4 sm:px-6 shadow-md">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/"
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeftIcon />
              Back to Homepage
            </Link>
          </div>
        </div>
        <header className="text-center mb-12">
          <h1 className="py-4 text-4xl sm:text-5xl text-slate-200 font-bold text-primary">
            Explore Research Papers
          </h1>
          <p className="text-lg text-base-content/80 mt-2">
            Discover insights and knowledge from various fields.
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="text-center py-10">
              <span className="loading loading-dots loading-lg text-primary"></span>
              <p className="mt-2">Loading papers...</p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="alert alert-error shadow-lg max-w-md mx-auto"
            >
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
              <div>
                <h3 className="font-bold">Error!</h3>
                <div className="text-xs">{error}</div>
              </div>
            </div>
          )}

          {!isLoading && !error && papers.length === 0 && (
            <div className="text-center py-20">
              <BookOpenIcon />
              <h2 className="text-2xl font-semibold mt-4 mb-2">
                Nothing to see here for now.
              </h2>
              <p className="text-base-content/70">
                No papers have been uploaded yet. Check back later!
              </p>
            </div>
          )}

          {!isLoading && !error && papers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  className="card flex bg-base-200 shadow-xl shadow-emerald-300 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  <div className="card-body">
                    <h2 className="card-title text-xl font-bold  mt-1 mb-2">
                      <Link
                        href={{
                          pathname: `/papers/${paper.id}`,
                        }}
                        className="link link-hover text-lg font-semibold text-primary-focus"
                      >
                        {paper.title}
                      </Link>
                    </h2>
                    <span className="text-sm text-slate-50 font-semibold uppercase tracking-wider">
                      {paper.topic || "General"}
                    </span>
                    <div className="flex items-center text-sm text-base-content/70 mb-4">
                      <UserCircleIcon />
                      <span>By {paper.authorName || "Unknown Author"}</span>
                    </div>
                    <div className="card-actions justify-between">
                      <Link
                        href={{
                          pathname: `/papers/${paper.id}`,
                        }}
                        className="btn btn-primary btn-sm "
                      >
                        Read Paper
                        <BookOpenIcon />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
