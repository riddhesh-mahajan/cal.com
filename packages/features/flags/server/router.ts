import { FeatureStatus } from "@calcom/prisma/enums";
import publicProcedure from "@calcom/trpc/server/procedures/publicProcedure";
import { router } from "@calcom/trpc/server/trpc";

import { getFeatureFlagMap } from "./utils";

export const featureFlagRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    return prisma.feature.findMany({
      orderBy: { slug: "asc" },
      cacheStrategy: { swr: 300, ttl: 300 },
    });
  }),
  listFlagStatuses: publicProcedure.query(async ({}) => {
    return FeatureStatus;
  }),
  map: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    return getFeatureFlagMap(prisma);
  }),
});
