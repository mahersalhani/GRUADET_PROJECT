import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const bodySans = Hanken_Grotesk({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  display: "swap",
});

const displaySans = Bricolage_Grotesque({
  variable: "--font-display-custom",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus — Type an idea. Ship an app.",
  description:
    "Dream it, type it, watch it ship. Nexus turns a single sentence into a live, running web app — built by AI agents in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2F62F4",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${bodySans.variable} ${displaySans.variable} ${monoFont.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
};
