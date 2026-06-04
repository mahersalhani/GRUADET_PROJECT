import { auth } from "@clerk/nextjs/server";
import { RateLimiterPrisma, RateLimiterRes } from "rate-limiter-flexible";

import { prisma } from "@/lib/db";

const FREE_POINTS = 2;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export class UsageAuthenticationError extends Error {
  constructor() {
    super("User not authenticated");
    this.name = "UsageAuthenticationError";
  }
}

export function isRateLimitExceeded(error: unknown): error is RateLimiterRes {
  return (
    error instanceof RateLimiterRes ||
    (
      typeof error === "object" &&
      error !== null &&
      "remainingPoints" in error &&
      "msBeforeNext" in error &&
      "consumedPoints" in error
    )
  );
}

export async function getUsageTracker() {
  const { has } = await auth();
  let hasProAccess = false;

  try {
    hasProAccess = has?.({ plan: "pro" }) ?? false;
  } catch (error) {
    console.warn("[usage] Failed to check pro access; using free quota.", error);
  }

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
};

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new UsageAuthenticationError();
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);
  return result;
};

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new UsageAuthenticationError();
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
};
