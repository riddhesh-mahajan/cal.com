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
  const { segmentId, name, emails, coverage, selection, coverageType, team } = input;

  // Get all users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  // Update segment
  const segment = await prisma.segment.update({
    where: {
      id: segmentId,
    },
    data: {
      name,
      coverage,
      selection,
      coverageType,
      teamFilter: team,
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    },
  });

  return {
    success: true,
    segment,
  };
};

export default updateSegmentHandler;
