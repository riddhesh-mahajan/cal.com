import { z } from "zod";

export const ZListSegmentsSchema = z.object({});

export type TListSegmentsSchema = z.infer<typeof ZListSegmentsSchema>;
