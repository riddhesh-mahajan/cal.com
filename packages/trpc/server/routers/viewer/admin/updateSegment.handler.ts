import { prisma } from "@calcom/prisma";
import {
  SegmentSelectionOptions,
  SegmentCoverageTypeOptions,
  SegmentTeamFilterOptions,
} from "@calcom/prisma/enums";

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

  // Delete exsiting segmentUsers
  await prisma.segmentUser.deleteMany({
    where: {
      segmentId,
    },
  });

  // Handle random selection
  if (selection === SegmentSelectionOptions.RANDOM) {
    // Get random users
    const totalUsers = await prisma.user.count();
    const randomUserIds = [];

    if (coverageUnit === SegmentCoverageTypeOptions.PERCENT) {
      const numberOfUsers = Math.floor((coverage / 100) * totalUsers);
      for (let i = 0; i < numberOfUsers; i++) {
        randomUserIds.push(Math.floor(Math.random() * totalUsers));
      }
    }

    if (coverageUnit === SegmentCoverageTypeOptions.USERS) {
      for (let i = 0; i < coverage; i++) {
        randomUserIds.push(Math.floor(Math.random() * totalUsers));
      }
    }

    const uniqueUserIds = Array.from(new Set(randomUserIds));

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueUserIds,
        },
      },
    });

    // Create segmentUsers
    users.forEach(async (user) => {
      // TODO: we can use bulk create here
      await prisma.segmentUser.create({
        data: {
          segment: {
            connect: {
              id: segment.id,
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
  }

  // Handle custom selection
  if (selection === SegmentSelectionOptions.CUSTOM) {
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
      // TODO: we can use bulk create here
      await prisma.segmentUser.create({
        data: {
          segment: {
            connect: {
              id: segment.id,
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
  }

  // Handle targeted selection
  if (selection === SegmentSelectionOptions.TARGETED) {
    // Get targeted users
    let targetedUsersFilter = {};

    if (team === SegmentTeamFilterOptions.ATLEAST_ONE_TEAM) {
      targetedUsersFilter = {
        ...targetedUsersFilter,
        teams: {
          some: {},
        },
      };
    }

    if (team === SegmentTeamFilterOptions.NO_TEAMS) {
      targetedUsersFilter = {
        ...targetedUsersFilter,
        teams: {
          none: {},
        },
      };
    }

    const users = await prisma.user.findMany({
      where: targetedUsersFilter,
    });

    // Create segmentUsers
    users.forEach(async (user) => {
      // TODO: we can use bulk create here
      await prisma.segmentUser.create({
        data: {
          segment: {
            connect: {
              id: segment.id,
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
  }

  return {
    success: true,
    segment,
  };
};

export default updateSegmentHandler;
