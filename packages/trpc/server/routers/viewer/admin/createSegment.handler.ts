import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TCreateSegmentSchema } from "./createSegment.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateSegmentSchema;
};

const createSegmentHandler = async ({ input }: GetOptions) => {
  console.log(input);
  const { name, emails, coverage, selection, coverageUnit, team, feature } = input;

  // Create segment
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

  const newSegment = await prisma.segment.create({
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

  // Create segmentUsers
  users.forEach(async (user) => {
    await prisma.segmentUser.create({
      data: {
        segment: {
          connect: {
            id: newSegment.id,
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
    newSegment,
  };
};

export default createSegmentHandler;
