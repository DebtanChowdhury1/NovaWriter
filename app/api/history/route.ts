import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { getUserHistory } from "@/lib/data/history";
import connectDb from "@/lib/db/mongoose";
import { GenerationModel } from "@/lib/models/generation";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const history = await getUserHistory(userId);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to load history", error);
    return NextResponse.json(
      { error: "Unable to fetch history at the moment." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id provided." }, { status: 400 });
  }

  await connectDb();
  await GenerationModel.deleteOne({ _id: id, userId });

  return NextResponse.json({ success: true });
}
