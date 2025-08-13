import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { courseMaterials, courses } from "../../../lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.userType !== "instructor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructorId = session.user.id as string;

  try {
    const materials = await db.query.courseMaterials.findMany({
      where: eq(courseMaterials.instructorId, instructorId),
      with: {
        course: {
          columns: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching instructor materials:", error);
    return NextResponse.json({ error: "Failed to fetch instructor materials." }, { status: 500 });
  }
}