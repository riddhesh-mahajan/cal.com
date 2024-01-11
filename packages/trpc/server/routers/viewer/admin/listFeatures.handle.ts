import { prisma } from "@calcom/prisma";

import type { TrpcSessionUser } from "../../../trpc";
import type { TListFeaturesSchema } from "./listFeatures.schema";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TListFeaturesSchema;
};

const listPaginatedHandler = async ({ input }: GetOptions) => {
  const features = await prisma.feature.findMany({
    orderBy: {
      slug: "asc",
    },
  });

  return {
    features,
  };
};

export default listPaginatedHandler;
