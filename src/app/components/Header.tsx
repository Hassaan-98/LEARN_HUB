"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useSession, signOut } from "next-auth/react"; // ✅ Import from next-auth/react

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Real session data
  const { data: session, status } = useSession();

  const { theme, setTheme } = useTheme();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setPopoverOpen(false);
    }, 200);
  };

  // ✅ Decide dashboard URL based on userType from session
  const dashboardUrl =
    session?.user?.userType === "student"
      ? "/dashboard/user"
      : "/dashboard/instructor";

  return (
    <header
      className={`fixed top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 shadow-sm border-b border-border/40"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          <span>LearnHub</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          <Link href="/courses">Courses</Link>
          <Link href="/instructors">Become Instructor</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/ai-personalities">AI Personalities</Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {status === "loading" ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                asChild
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Avatar className="size-8 cursor-pointer">
                  <AvatarImage
                    src={session.user?.image || "/placeholder.svg"}
                    alt={session.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-2 border-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost">
                    <Link href={dashboardUrl}>Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Avatar className="size-8 cursor-pointer">
                  <AvatarImage src="/placeholder.svg" alt="Guest" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="flex flex-col gap-2">
                  <Link href="/sign-in">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="ghost">Sign Up</Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 border-b"
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/courses">Courses</Link>
            <Link href="/instructors">Become Instructor</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/ai-personalities">AI Personalities</Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              {status === "loading" ? (
                <div>Loading...</div>
              ) : session ? (
                <>
                  <Button asChild variant="ghost">
                    <Link href={dashboardUrl}>Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Log in</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="ghost">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
