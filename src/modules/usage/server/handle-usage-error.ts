import { TRPCError } from "@trpc/server";

import {
  isRateLimitExceeded,
  UsageAuthenticationError,
} from "@/lib/usage";

type UsageErrorSource = "projects.create" | "messages.create";

export function throwUsageTRPCError(
  error: unknown,
  source: UsageErrorSource,
): never {
  if (isRateLimitExceeded(error)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "You have run out of credits",
    });
  }

  if (error instanceof UsageAuthenticationError) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  console.error(`[${source}] Failed to consume credits`, error);

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Unable to verify usage credits",
  });
}
