import type { PrismaClient } from "@calcom/prisma";

import type { AppFlags } from "../config";

export async function getFeatureFlagMap(prisma: PrismaClient) {
  const flags = await prisma.feature.findMany({
    orderBy: { slug: "asc" },
    cacheStrategy: { swr: 300, ttl: 300 },
  });
  return flags.reduce<AppFlags>((acc, flag) => {
    acc[flag.slug as keyof AppFlags] = {
      enabled: flag.enabled,
      status: flag.status,
    };
    return acc;
  }, {} as AppFlags);
}

export async function isIAmInPilotingSegment(prisma: PrismaClient, featureSlug: string, userId: number) {
  const targetFeature = await prisma.feature.findUnique({
    where: { slug: featureSlug },
    include: {
      segment: true,
    },
  });

  if (!targetFeature) {
    return false;
  }

  const targetSegment = targetFeature.segment;

  if (!targetSegment) {
    return false;
  }

  const targetSegmentUser = await prisma.segmentUser.findFirst({
    where: {
      segmentId: targetSegment.id,
      userId,
    },
  });

  if (!targetSegmentUser) {
    return false;
  }

  return true;
}
