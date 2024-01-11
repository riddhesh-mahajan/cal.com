import { z } from "zod";

export const ZCreateSegmentSchema = z.object({
  name: z.string(),
  emails: z.array(z.string()),
  coverage: z.number(),
  selection: z.enum(["RANDOM", "CUSTOM", "TARGETED"]),
  coverageType: z.enum(["PERCENT", "USERS"]),
  team: z.enum(["ALL", "NO_TEAMS", "ATLEAST_ONE_TEAM"]),
  feature: z.string().optional(),
});

export type TCreateSegmentSchema = z.infer<typeof ZCreateSegmentSchema>;
