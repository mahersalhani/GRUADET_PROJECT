"use client";

import Image from "next/image";
import { dark } from "@clerk/themes";
import { PricingTable } from "@clerk/nextjs";

import { useCurrentTheme } from "@/hooks/use-current-theme";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return ( 
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image 
            src="/logo.png"
            alt="Nexus"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="font-display text-2xl md:text-4xl font-bold text-center tracking-tight">
          Pick your <span className="text-gradient-blue">superpower</span>
        </h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Start free. Scale up the moment you&apos;re ready to ship more.
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!"
            }
          }}
        />
      </section>
    </div>
   );
}
 
export default Page;