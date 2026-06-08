"use client";

import Image from "next/image";
import { RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  reset: () => void;
}

const ErrorPage = ({ reset }: ErrorPageProps) => {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="hero-aura pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] w-full" />
      <Image
        src="/logo.png"
        alt="Nexus"
        width={56}
        height={56}
        className="opacity-90"
      />
      <div className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Well, that <span className="text-gradient-blue">glitched</span>.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Something broke on our end. Give it another shot — most hiccups clear
          right up.
        </p>
      </div>
      <Button onClick={reset} size="lg" className="rounded-full">
        <RotateCwIcon className="size-4" />
        Try again
      </Button>
    </main>
  );
};

export default ErrorPage;
