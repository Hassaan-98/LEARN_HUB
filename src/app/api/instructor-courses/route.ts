import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { courses } from "../../../lib/schema";
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
    const instructorCourses = await db.query.courses.findMany({
      where: eq(courses.instructorId, instructorId),
    });
    return NextResponse.json(instructorCourses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return NextResponse.json({ error: "Failed to fetch instructor courses." }, { status: 500 });
  }
}