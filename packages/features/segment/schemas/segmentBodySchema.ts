import { z } from "zod";

import { optionToValueSchema } from "@calcom/prisma/zod-utils";

export const segmentBodySchema = z
  .object({
    name: z.string(),
    emails: z.array(z.string()),
    coverage: z.number(),
    selection: optionToValueSchema(z.enum(["RANDOM", "CUSTOM", "TARGETED"])),
    coverageUnit: optionToValueSchema(z.enum(["PERCENT", "USERS"])),
    team: optionToValueSchema(z.enum(["ALL", "NO_TEAMS", "ATLEAST_ONE_TEAM"])),
    feature: optionToValueSchema(z.string().optional()),
  })
  .passthrough();
