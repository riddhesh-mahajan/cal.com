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
  const { name, emails, coverage, selection, coverageType, team, feature } = input;

  // Get all users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  // Create segment
  const data: any = {
    name,
    coverage,
    selection,
    coverageType,
    teamFilter: team,
    users: {
      connect: users.map((user) => ({
        id: user.id,
      })),
    },
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

  return {
    success: true,
    newSegment,
  };
};

export default createSegmentHandler;
