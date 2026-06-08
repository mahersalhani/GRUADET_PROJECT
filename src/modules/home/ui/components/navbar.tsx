"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";

export const Navbar = () => {
  const isScrolled = useScroll();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-3xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isScrolled && "top-2 max-w-2xl"
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center gap-3 rounded-full pl-4 pr-2 py-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border border-border shadow-lg shadow-primary/10"
            : "bg-background/30 backdrop-blur-md border border-border/40"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group pr-2">
          <Image
            src="/logo.png"
            alt="Nexus"
            width={24}
            height={24}
            className="transition-transform duration-300 group-hover:rotate-[18deg] group-hover:scale-110"
          />
          <span className="font-display font-bold text-lg tracking-tight">Nexus</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="ghost" size="sm" className="rounded-full">
                Sign up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm" className="rounded-full">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
};
