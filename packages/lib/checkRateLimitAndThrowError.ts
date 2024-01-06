import { TRPCError } from "@calcom/trpc/server";

import type { RateLimitHelper } from "./rateLimit";
import { rateLimiter, acquireLock } from "./rateLimit";

export async function checkRateLimitAndThrowError({
  rateLimitingType = "core",
  identifier,
  useLock = false,
  lockUid = "0",
}: RateLimitHelper) {
  const { remaining, reset } = await rateLimiter()({ rateLimitingType, identifier });

  if (useLock && lockUid == "0") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Lock uid is required`,
    });
  }
  if (useLock) {
    if ((await acquireLock(lockUid)) == false) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Too many concurrent requests. Try again in 30 seconds.`,
      });
    }
  }

  if (remaining < 1) {
    const convertToSeconds = (ms: number) => Math.floor(ms / 1000);
    const secondsToWait = convertToSeconds(reset - Date.now());
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Try again in ${secondsToWait} seconds.`,
    });
  }
}
