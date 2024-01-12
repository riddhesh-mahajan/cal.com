import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TUpdateSegmentSchema } from "./updateSegment.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateSegmentSchema;
};

const updateSegmentHandler = async ({ input }: GetOptions) => {
  console.log(input);
  const { segmentId, name, emails, coverage, selection, coverageUnit, team, feature } = input;

  // Update segment
  const data: any = {
    name,
    coverage,
    selection,
    coverageUnit,
    teamFilter: team,
  };

  if (feature) {
    data.feature = {
      connect: {
        slug: feature,
      },
    };
  }
  const segment = await prisma.segment.update({
    where: {
      id: segmentId,
    },
    data: data,
  });

  // Get all users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  // Delete exsiting segmentUsers
  await prisma.segmentUser.deleteMany({
    where: {
      segmentId,
    },
  });

  // Create segmentUsers
  users.forEach(async (user) => {
    await prisma.segmentUser.create({
      data: {
        segment: {
          connect: {
            id: segmentId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });

  return {
    success: true,
    segment,
  };
};

export default updateSegmentHandler;
