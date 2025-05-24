// File: pages/api/papers/[id]/royalty-splits.ts
import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../../db"; // Adjust path to your db setup
import { royaltySplitsTable } from "../../../../db/schema"; // Adjust path
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Define the expected structure for a royalty split
interface RoyaltySplit {
  wallet_address: string;
  percentage: number; // Assuming this is stored as 1-100, needs conversion to basis points for contract
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const paperId = parseInt(params.id, 10);

    if (isNaN(paperId)) {
      return NextResponse.json(
        { error: "Invalid paper ID format" },
        { status: 400 },
      );
    }

    const splits: RoyaltySplit[] = await db
      .select({
        wallet_address: royaltySplitsTable.wallet_address,
        percentage: royaltySplitsTable.percentage,
      })
      .from(royaltySplitsTable)
      .where(eq(royaltySplitsTable.paper_id, paperId))
      .execute();

    if (!splits || splits.length === 0) {
      // It's okay if a paper has no explicit splits (e.g., all to primary author, handled differently)
      // or if the primary author is the sole recipient.
      // For this contract, we need recipients and percentages.
      // If no splits are found, the contract call might need to be adjusted
      // or it implies the primary author gets 100%.
      // For now, return empty if no entries in royaltySplitsTable.
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(splits, { status: 200 });
  } catch (error) {
    console.error(
      `Error fetching royalty splits for paper ID ${params.id}:`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch royalty splits", details: errorMessage },
      { status: 500 },
    );
  }
}
