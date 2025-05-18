import { NextResponse } from "next/server";
import { db } from "../../db"; // Adjust path as per your project structure
import { papersTable, usersTable } from "../../db/schema"; // Adjust path
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic"; // Ensures fresh data on each request

export async function GET() {
  try {
    // Fetch papers and join with usersTable to get the author's name
    // Assuming usersTable has a 'name' field for the author
    const papersWithAuthors = await db
      .select({
        id: papersTable.id,
        title: papersTable.title,
        link: papersTable.link,
        topic: papersTable.topic,
        authorName: usersTable.name, // Assuming 'name' field in usersTable
        authorId: usersTable.id,
        authorWallet: usersTable.wallet_address, // Fetching wallet for potential use on paper page
      })
      .from(papersTable)
      .leftJoin(usersTable, eq(papersTable.author_id, usersTable.id))
      .orderBy(desc(papersTable.id)); // Show newest papers first

    if (!papersWithAuthors || papersWithAuthors.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no papers
    }

    return NextResponse.json(papersWithAuthors, { status: 200 });
  } catch (error) {
    console.error("Error fetching papers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch papers", details: errorMessage },
      { status: 500 },
    );
  }
}
