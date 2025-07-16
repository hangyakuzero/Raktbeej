'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface RoyaltySplit {
  wallet_address: string;
  percentage: number;
}

interface Paper {
  id: number;
  title: string;
  topic: string;
  link: string;
  splits?: RoyaltySplit[];
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPapers = async () => {
      try {
        const res = await fetch(
          `/api/dashboard?email=${encodeURIComponent(
            user.primaryEmailAddress?.emailAddress || ''
          )}`,
          { cache: 'no-store' }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load papers');
        }

        const data = await res.json();
        setPapers(data.papers || []);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [user, isLoaded]);

  if (!isLoaded || loading) return <p className="text-center mt-10">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Uploaded Papers</h1>

      {papers.length === 0 ? (
        <p className="text-center">You haven’t uploaded any papers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Title</th>
                <th>Topic</th>
                <th>Royalty Splits</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => (
                <tr key={paper.id}>
                  <td>{paper.title}</td>
                  <td>{paper.topic}</td>
                  <td>
                    {!paper.splits || paper.splits.length === 0 ? (
                      <span className="text-gray-400">100% to you</span>
                    ) : (
                      <table className="table table-xs border rounded bg-base-200">
                        <thead>
                          <tr>
                            <th>Wallet</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paper.splits.map((split, index) => (
                            <tr key={index}>
                              <td className="font-mono truncate max-w-[150px]">{split.wallet_address}</td>
                              <td>{split.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                  <td>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
