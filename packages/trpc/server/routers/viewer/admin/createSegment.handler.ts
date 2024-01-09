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

  // TODO: Implement this handler

  return {
    success: true,
    input,
  };
};

export default createSegmentHandler;
