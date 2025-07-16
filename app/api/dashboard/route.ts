// File: app/api/dashboard/route.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../db"; // Adjust if needed
import {
  usersTable,
  papersTable,
  royaltySplitsTable,
} from "../../db/schema"; // Adjust if needed
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = req.nextUrl.searchParams.get("email");
  if (!userEmail)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  // Get the user
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get all papers by the user
  const papers = await db
    .select({
      id: papersTable.id,
      title: papersTable.title,
      topic: papersTable.topic,
      link: papersTable.link,
    })
    .from(papersTable)
    .where(eq(papersTable.author_id, user.id));

  // For each paper, get royalty splits
  const papersWithSplits = await Promise.all(
    papers.map(async (paper) => {
      const splits = await db
        .select({
          wallet_address: royaltySplitsTable.wallet_address,
          percentage: royaltySplitsTable.percentage,
        })
        .from(royaltySplitsTable)
        .where(eq(royaltySplitsTable.paper_id, paper.id));

      return {
        ...paper,
        splits, // even if empty
      };
    })
  );

  return NextResponse.json({ papers: papersWithSplits }, { status: 200 });
}
