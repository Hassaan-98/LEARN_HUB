"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  const courseCategories = [
    { title: "Web Development", path: "/courses/web-development" },
    { title: "Data Science", path: "/courses/data-science" },
    { title: "UI/UX Design", path: "/courses/ui-ux" },
    { title: "Digital Marketing", path: "/courses/marketing" },
    { title: "Business & Management", path: "/courses/business" },
    { title: "Personal Development", path: "/courses/personal-development" },
    { title: "Photography & Video", path: "/courses/photography" },
    { title: "Music & Audio", path: "/courses/music" },
  ];

  const resources = [
    { title: "Blog", path: "/blog" },
    { title: "Help Center", path: "/help" },
    { title: "Student Guide", path: "/student-guide" },
    { title: "Instructor Guide", path: "/instructor-guide" },
    { title: "Community Forum", path: "/community" },
    { title: "Events & Webinars", path: "/events" },
    { title: "Certifications", path: "/certifications" },
  ];

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-6xl mx-auto z-50",
        className
      )}
    >
      <Menu setActive={setActive}>
        
        {/* Courses */}
        <MenuItem setActive={setActive} active={active} item="Courses">
          <div className="grid grid-cols-2 gap-6 text-md">
            {courseCategories.map((course, idx) => (
              <HoveredLink href={course.path} key={idx}>
                {course.title}
              </HoveredLink>
            ))}
          </div>
        </MenuItem>

        {/* Teach */}
        <MenuItem setActive={setActive} active={active} item="Teach">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/teach">Become an Instructor</HoveredLink>
            <HoveredLink href="/course-creation">Course Creation Guide</HoveredLink>
            <HoveredLink href="/instructor-dashboard">Instructor Dashboard</HoveredLink>
            <HoveredLink href="/teaching-center">Teaching Center</HoveredLink>
            <HoveredLink href="/partner-programs">Partner Programs</HoveredLink>
          </div>
        </MenuItem>

        {/* Resources */}
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            {resources.map((resource, idx) => (
              <HoveredLink href={resource.path} key={idx}>
                {resource.title}
              </HoveredLink>
            ))}
          </div>
        </MenuItem>

        {/* Tools */}
        <MenuItem setActive={setActive} active={active} item="Tools">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Course Builder Pro"
              href="/tools/course-builder"
              src="/images/course-builder.png"
              description="Create engaging courses with ease."
            />
            <ProductItem
              title="QuizMaster"
              href="/tools/quizmaster"
              src="/images/quiz-tool.png"
              description="Interactive quizzes and assessments."
            />
            <ProductItem
              title="CertifyMe"
              href="/tools/certifyme"
              src="/images/certifyme.png"
              description="Automatic certificate generation."
            />
            <ProductItem
              title="Analytics Hub"
              href="/tools/analytics"
              src="/images/analytics.png"
              description="Track your learners’ progress in real time."
            />
            <ProductItem
              title="LiveClass"
              href="/tools/liveclass"
              src="/images/liveclass.png"
              description="Host interactive live classes."
            />
            <ProductItem
              title="Discussion Boards"
              href="/tools/discussions"
              src="/images/discussions.png"
              description="Engage students in course discussions."
            />
          </div>
        </MenuItem>

        {/* Pricing */}
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/pricing">Plans & Pricing</HoveredLink>
            <HoveredLink href="/business">For Business</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise Solutions</HoveredLink>
          </div>
        </MenuItem>

        {/* Account */}
        <MenuItem setActive={setActive} active={active} item="Account">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/login">Login</HoveredLink>
            <HoveredLink href="/signup">Sign Up</HoveredLink>
            <HoveredLink href="/my-learning">My Learning</HoveredLink>
            <HoveredLink href="/wishlist">Wishlist</HoveredLink>
            <HoveredLink href="/profile">Profile</HoveredLink>
          </div>
        </MenuItem>

      </Menu>
    </div>
  );
}

export default Navbar;
