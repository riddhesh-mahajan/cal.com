import { prisma } from "@calcom/prisma";
import {
  SegmentSelectionOptions,
  SegmentCoverageTypeOptions,
  SegmentTeamFilterOptions,
} from "@calcom/prisma/enums";

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
    const listOfSegmentUsersToCreate: any = [];
    users.forEach(async (user) => {
      listOfSegmentUsersToCreate.push({
        segmentId: newSegment.id,
        userId: user.id,
      });
    });

    await prisma.segmentUser.createMany({
      data: listOfSegmentUsersToCreate,
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
    const listOfSegmentUsersToCreate: any = [];
    users.forEach(async (user) => {
      listOfSegmentUsersToCreate.push({
        segmentId: newSegment.id,
        userId: user.id,
      });
    });

    await prisma.segmentUser.createMany({
      data: listOfSegmentUsersToCreate,
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
          some: {},
        },
      };
    }

    const users = await prisma.user.findMany({
      where: targetedUsersFilter,
    });

    // Create segmentUsers
    const listOfSegmentUsersToCreate: any = [];
    users.forEach(async (user) => {
      listOfSegmentUsersToCreate.push({
        segmentId: newSegment.id,
        userId: user.id,
      });
    });

    await prisma.segmentUser.createMany({
      data: listOfSegmentUsersToCreate,
    });
  }

  return {
    success: true,
    newSegment,
  };
};

export default createSegmentHandler;
