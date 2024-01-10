import { z } from "zod";

export const ZGetSegmentSchema = z.object({
  segmentId: z.number(),
});

export type TGetSegmentSchema = z.infer<typeof ZGetSegmentSchema>;
