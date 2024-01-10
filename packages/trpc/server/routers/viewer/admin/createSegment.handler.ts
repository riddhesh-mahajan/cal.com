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
  const { name, emails, coverage, selection, coverageType, team } = input;

  // Get all users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  // Create segment
  const newSegment = await prisma.segment.create({
    data: {
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
    },
  });

  return {
    success: true,
    newSegment,
  };
};

export default createSegmentHandler;
