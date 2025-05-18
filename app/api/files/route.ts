import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";
import { db } from "../../db";
import { papersTable, usersTable, royaltySplitsTable } from "../../db/schema";
import type { InferInsertModel } from "drizzle-orm";
import { eq, sql } from "drizzle-orm"; // Make sure sql is imported for atomic updates

// type NewPaper = InferInsertModel<typeof papersTable>; // Not strictly needed if you only use the ID

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    // Ensure file exists before proceeding
    if (!file) {
      return NextResponse.json({ error: "File is missing." }, { status: 400 });
    }
    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);

    const title = data.get("title")?.toString();
    const topic = data.get("topic")?.toString();
    const email = data.get("email")?.toString();

    if (!email || !title || !topic) {
      // file check done above
      return NextResponse.json(
        { error: "Missing required fields: email, title, or topic." },
        { status: 400 },
      );
    }

    const userResult = await db
      .select({
        id: usersTable.id,
        papers_uploaded: usersTable.papers_uploaded,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)
      .execute();

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const currentUser = userResult[0];

    // --- Consider wrapping DB operations in a transaction from here ---
    // await db.transaction(async (tx) => {
    //   // Use 'tx' instead of 'db' for operations inside the transaction

    const insertedPaperResult = await db // or tx
      .insert(papersTable)
      .values({
        title: title!,
        topic: topic!,
        link: url!,
        author_id: currentUser.id,
      })
      .returning({ id: papersTable.id })
      .execute();

    if (
      !insertedPaperResult ||
      insertedPaperResult.length === 0 ||
      !insertedPaperResult[0]?.id
    ) {
      console.error("Paper insertion failed or did not return an ID.");
      // If in a transaction, throw an error here to cause rollback:
      // throw new Error("Paper insertion failed or did not return an ID.");
      return NextResponse.json(
        { error: "Failed to create paper record." },
        { status: 500 },
      );
    }
    const paperId = insertedPaperResult[0].id;

    await db // or tx
      .update(usersTable)
      .set({ papers_uploaded: sql`${usersTable.papers_uploaded} + 1` }) // Atomic increment
      .where(eq(usersTable.id, currentUser.id)); // More precise to use ID

    // 4. Correctly Parse and Insert royalty splits into royaltySplitsTable
    const royaltySplitsToInsert: InferInsertModel<typeof royaltySplitsTable>[] =
      [];
    let i = 0;
    while (true) {
      const walletKey = `royalty_split_wallet_${i}`;
      const percentageKey = `royalty_split_percentage_${i}`;

      const walletAddress = data.get(walletKey)?.toString();
      const percentageString = data.get(percentageKey)?.toString();

      // If a walletAddress for the current index doesn't exist, we assume no more splits
      if (!walletAddress) {
        break;
      }

      const percentage = Number(percentageString); // Converts undefined/null to 0

      // Ensure walletAddress is not an empty string and percentage is valid
      if (walletAddress.trim() !== "" && percentage > 0) {
        royaltySplitsToInsert.push({
          paper_id: paperId,
          wallet_address: walletAddress,
          percentage: percentage,
        });
      } else {
        // Log if a split is found but skipped due to invalid data
        console.warn(
          `Skipping royalty split for index ${i}: Wallet: '${walletAddress}', Percentage String: '${percentageString}' (Parsed as: ${percentage}) for paper ID ${paperId}`,
        );
      }
      i++;
    }

    if (royaltySplitsToInsert.length > 0) {
      await db
        .insert(royaltySplitsTable)
        .values(royaltySplitsToInsert)
        .execute(); // or tx.insert
      console.log(
        `Successfully inserted ${royaltySplitsToInsert.length} royalty splits for paper ID ${paperId}.`,
      );
    } else {
      console.log(
        `No valid royalty splits provided or processed for paper ID ${paperId}.`,
      );
    }

    // --- End of transaction block if you use it ---
    // }); // End of db.transaction

    return NextResponse.json(
      { url, message: "Upload successful!" },
      { status: 200 },
    );
  } catch (e) {
    console.error("Error during POST /api/files:", e);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: e instanceof Error ? e.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

