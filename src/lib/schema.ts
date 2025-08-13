import { mysqlTable, varchar, text, timestamp, int, decimal, boolean, json } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  password: text("password").notNull(),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'student' or 'instructor'
  profilePhoto: text("profile_photo"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const instructorProfiles = mysqlTable("instructor_profiles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  headline: text("headline"),
  bio: text("bio"),
  expertise: text("expertise"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  languages: json("languages"), // JSON array
  specializations: json("specializations"), // JSON array
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const studentProfiles = mysqlTable("student_profiles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  bio: text("bio"),
  interests: json("interests"), // JSON array
  learningGoals: text("learning_goals"),
  experience: varchar("experience", { length: 50 }), 
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const courses = mysqlTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  instructorId: varchar("instructor_id", { length: 36 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  level: varchar("level", { length: 50 }),
  language: varchar("language", { length: 50 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  duration: varchar("duration", { length: 50 }),
  thumbnailUrl: text("thumbnail_url"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  isPublished: boolean("is_published").notNull().default(false),
  whatYoullLearn: json("what_youll_learn").notNull().default([]),
  requirements: json("requirements").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const modules = mysqlTable("modules", {
  id: varchar("id", { length: 36 }).primaryKey(),
  courseId: varchar("course_id", { length: 36 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: int("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const lessons = mysqlTable("lessons", {
  id: varchar("id", { length: 36 }).primaryKey(),
  moduleId: varchar("module_id", { length: 36 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 50 }),
  videoUrl: text("video_url"),
  orderIndex: int("order_index").notNull(),
  isPreview: boolean("is_preview").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const enrollments = mysqlTable("enrollments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  course_id: varchar("course_id", { length: 36 }).notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
  progress: int("progress").default(0), // percentage
  completedAt: timestamp("completed_at"),
  certificateIssued: boolean("certificate_issued").default(false),
})

export const courseReviews = mysqlTable("course_reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  courseId: varchar("course_id", { length: 36 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
   fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const lessonProgress = mysqlTable("lesson_progress", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("userId", { length: 36 }).notNull(),
  lessonId: varchar("lessonId", { length: 36 }).notNull(),
  progressPercentage: int("progressPercentage"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
});


export const courseMaterials = mysqlTable("course_materials", {
  id: varchar("id", { length: 36 }).primaryKey(),
  courseId: varchar("course_id", { length: 36 }).notNull(),
  instructorId: varchar("instructor_id", { length: 36 }).notNull(),
  lessonId: varchar("lesson_id", { length: 36 }),
  moduleTitle: varchar("module_title", { length: 255 }),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: int("file_size").notNull(),
  playbackId: varchar("playback_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const instructorPaymentDetails = mysqlTable("instructor_payment_details", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  stripeAccountId: varchar("stripe_account_id", { length: 255 }).notNull(),
  bankAccountDetails: json("bank_account_details"), // JSON for bank details
  isVerified: boolean("is_verified").default(false),
  courseIds: json("course_ids").notNull().default([]), // JSON array of course IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const studentPaymentDetails = mysqlTable("student_payment_details", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
  paymentMethod: json("payment_method"), // JSON for payment method details
  isVerified: boolean("is_verified").default(false),
  courseIds: json("course_ids").notNull().default([]), // JSON array of purchased course IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  planId: varchar("plan_id", { length: 20 }).notNull(), // e.g., "free", "pro", "team"
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull().default("0.00"),
  status: varchar("status", { length: 20 }).notNull().default("active"), // e.g., "active", "canceled"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  instructorProfile: one(instructorProfiles, {
    fields: [users.id],
    references: [instructorProfiles.userId],
  }),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  instructorPaymentDetails: one(instructorPaymentDetails, {
    fields: [users.id],
    references: [instructorPaymentDetails.userId],
  }),
  studentPaymentDetails: one(studentPaymentDetails, {
    fields: [users.id],
    references: [studentPaymentDetails.userId],
  }),
  subscriptions: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  courses: many(courses),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
  lessonProgress: many(lessonProgress),
}))

export const instructorProfilesRelations = relations(instructorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [instructorProfiles.userId],
    references: [users.id],
  }),
}))

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  progress: many(lessonProgress),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.user_id],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.course_id],
    references: [courses.id],
  }),
}))

export const courseReviewsRelations = relations(courseReviews, ({ one }) => ({
  user: one(users, {
    fields: [courseReviews.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [courseReviews.courseId],
    references: [courses.id],
  }),
}))

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}))

export const instructorPaymentDetailsRelations = relations(instructorPaymentDetails, ({ one }) => ({
  user: one(users, {
    fields: [instructorPaymentDetails.userId],
    references: [users.id],
  }),
}))

export const studentPaymentDetailsRelations = relations(studentPaymentDetails, ({ one }) => ({
  user: one(users, {
    fields: [studentPaymentDetails.userId],
    references: [users.id],
  }),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))