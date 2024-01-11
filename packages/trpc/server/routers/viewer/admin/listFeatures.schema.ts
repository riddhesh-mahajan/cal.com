import { z } from "zod";

export const ZListFeaturesSchema = z.object({});

export type TListFeaturesSchema = z.infer<typeof ZListFeaturesSchema>;
