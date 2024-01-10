import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TGetSegmentSchema } from "./getSegment.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetSegmentSchema;
};

const getSegmentHandler = async ({ input }: GetOptions) => {
  const segment = await prisma.segment.findFirst({
    where: { id: input.segmentId },
  });

  return {
    segment,
  };
};

export default getSegmentHandler;
