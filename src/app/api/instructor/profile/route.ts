import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { db } from "../../../../lib/db"
import { users, instructorProfiles } from "../../../../lib/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const [profile] = await db
      .select()
      .from(instructorProfiles)
      .where(eq(instructorProfiles.userId, session.user.id))
      .limit(1)

    return NextResponse.json({
      user,
      profile: profile || null,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { user: userData, profile: profileData } = data

    // Update user data
    if (userData) {
      await db
        .update(users)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePhoto: userData.profilePhoto,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
    }

    // Update or create instructor profile
    if (profileData) {
      const [existingProfile] = await db
        .select()
        .from(instructorProfiles)
        .where(eq(instructorProfiles.userId, session.user.id))
        .limit(1)

      if (existingProfile) {
        await db
          .update(instructorProfiles)
          .set({
            headline: profileData.headline,
            bio: profileData.bio,
            expertise: profileData.expertise,
            website: profileData.website,
            linkedinUrl: profileData.linkedinUrl,
            twitterUrl: profileData.twitterUrl,
            country: profileData.country,
            city: profileData.city,
            languages: profileData.languages,
            specializations: profileData.specializations,
            updatedAt: new Date(),
          })
          .where(eq(instructorProfiles.userId, session.user.id))
      } else {
        await db.insert(instructorProfiles).values({
          id: uuidv4(),
          userId: session.user.id,
          headline: profileData.headline,
          bio: profileData.bio,
          expertise: profileData.expertise,
          website: profileData.website,
          linkedinUrl: profileData.linkedinUrl,
          twitterUrl: profileData.twitterUrl,
          country: profileData.country,
          city: profileData.city,
          languages: profileData.languages,
          specializations: profileData.specializations,
        })
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
