import { NextResponse } from "next/server";
import { db } from "../../../db"; // Adjust the path based on your structure
import { papersTable, usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const paperId = parseInt(params.id);

  if (isNaN(paperId)) {
    return NextResponse.json({ error: "Invalid paper ID" }, { status: 400 });
  }

  try {
    const result = await db
      .select({
        id: papersTable.id,
        title: papersTable.title,
        link: papersTable.link,
        topic: papersTable.topic,
        authorName: usersTable.name,
        authorId: usersTable.id,
      })
      .from(papersTable)
      .leftJoin(usersTable, eq(papersTable.author_id, usersTable.id))
      .where(eq(papersTable.id, paperId));

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json(
      { error: "Failed to fetch paper details" },
      { status: 500 },
    );
  }
}
