import { z } from "zod";

import { authedAdminProcedure } from "../../../procedures/authedProcedure";
import { router, importHandler } from "../../../trpc";
import { ZCreateSegmentSchema } from "./createSegment.schema";
import { ZGetSegmentSchema } from "./getSegment.schema";
import { ZListFeaturesSchema } from "./listFeatures.schema";
import { ZListMembersSchema } from "./listPaginated.schema";
import { ZListSegmentsSchema } from "./listSegments.schema";
import { ZAdminLockUserAccountSchema } from "./lockUserAccount.schema";
import { ZAdminPasswordResetSchema } from "./sendPasswordReset.schema";
import { ZUpdateSegmentSchema } from "./updateSegment.schema";

const NAMESPACE = "admin";

const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const adminRouter = router({
  listPaginated: authedAdminProcedure.input(ZListMembersSchema).query(async (opts) => {
    const handler = await importHandler(namespaced("listPaginated"), () => import("./listPaginated.handler"));
    return handler(opts);
  }),
  sendPasswordReset: authedAdminProcedure.input(ZAdminPasswordResetSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("sendPasswordReset"),
      () => import("./sendPasswordReset.handler")
    );
    return handler(opts);
  }),
  lockUserAccount: authedAdminProcedure.input(ZAdminLockUserAccountSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("lockUserAccount"),
      () => import("./lockUserAccount.handler")
    );
    return handler(opts);
  }),
  toggleFeatureFlag: authedAdminProcedure
    .input(z.object({ slug: z.string(), enabled: z.boolean() }))
    .mutation(({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { slug, enabled } = input;
      return prisma.feature.update({
        where: { slug },
        data: { enabled, updatedBy: user.id },
      });
    }),
  updateFeatureStatus: authedAdminProcedure
    .input(z.object({ slug: z.string(), status: z.string() }))
    .mutation(({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { slug, status } = input;
      return prisma.feature.update({
        where: { slug },
        data: { status, updatedBy: user.id },
      });
    }),
  createSegment: authedAdminProcedure.input(ZCreateSegmentSchema).mutation(async (opts) => {
    const handler = await importHandler(namespaced("createSegment"), () => import("./createSegment.handler"));
    return handler(opts);
  }),
  listSegments: authedAdminProcedure.input(ZListSegmentsSchema).query(async (opts) => {
    const handler = await importHandler(namespaced("listSegments"), () => import("./listSegments.handler"));
    return handler(opts);
  }),
  getSegment: authedAdminProcedure.input(ZGetSegmentSchema).query(async (opts) => {
    const handler = await importHandler(namespaced("getSegment"), () => import("./getSegment.handler"));
    return handler(opts);
  }),
  updateSegment: authedAdminProcedure.input(ZUpdateSegmentSchema).mutation(async (opts) => {
    const handler = await importHandler(namespaced("updateSegment"), () => import("./updateSegment.handler"));
    return handler(opts);
  }),
  listFeatures: authedAdminProcedure.input(ZListFeaturesSchema).query(async (opts) => {
    const handler = await importHandler(namespaced("listFeatures"), () => import("./listFeatures.handle"));
    return handler(opts);
  }),
});
