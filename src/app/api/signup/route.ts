import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import { users, instructorProfiles, studentProfiles } from "../../../lib/schema";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { firstName, lastName, email, password, userType, expertise } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !userType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate userType
    if (!["student", "instructor"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Validate expertise for instructors
    if (userType === "instructor" && (!expertise || expertise.length < 3)) {
      return NextResponse.json(
        { error: "Expertise is required for instructors and must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });

    // Create profile based on user type
    if (userType === "instructor") {
      await db.insert(instructorProfiles).values({
        id: uuidv4(),
        userId,
        expertise,
      });
    } else {
      await db.insert(studentProfiles).values({
        id: uuidv4(),
        userId,
      });
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}