import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TListSegmentsSchema } from "./listSegments.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TListSegmentsSchema;
};

const listSegmentsHandler = async ({ input }: GetOptions) => {
  const segments = await prisma.segment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    segments,
  };
};

export default listSegmentsHandler;
