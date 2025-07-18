import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Basic user info
  const clerkUser = body.data;

  const email = clerkUser.email_addresses?.[0]?.email_address;
  const name =
    `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim();
  const wallet_address = ""; // you may fill this later

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Check if user already exists (idempotent webhook)
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existing.length > 0) {
    return NextResponse.json({ message: "User already exists" });
  }

  await db.insert(usersTable).values({
    name,
    email,
    wallet_address,
  });

  return NextResponse.json({ message: "User added" });
}
