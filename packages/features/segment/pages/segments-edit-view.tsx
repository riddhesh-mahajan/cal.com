"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

import NoSSR from "@calcom/core/components/NoSSR";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import { getParserWithGeneric } from "@calcom/prisma/zod-utils";
import { trpc } from "@calcom/trpc";
import { Meta, SkeletonText, SkeletonContainer, showToast } from "@calcom/ui";

import { SegmentForm } from "../components/SegmentForm";
import { segmentBodySchema } from "../schemas/segmentBodySchema";

const SkeletonLoader = () => {
  return (
    <SkeletonContainer>
      <div className="divide-subtle mb-8 mt-6 space-y-6">
        <SkeletonText className="h-8 w-full" />
        <SkeletonText className="h-8 w-full" />
      </div>
    </SkeletonContainer>
  );
};

const segmentIdSchema = z.object({ id: z.coerce.number() });

export const SegmentEditPage = () => {
  const params = useParamsWithFallback();
  const input = segmentIdSchema.safeParse(params);

  if (!input.success) return <div>Invalid input</div>;

  return <SegmentEditView segmentId={input.data.id} />;
};

const SegmentEditView = ({ segmentId }: { segmentId: number }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [data] = trpc.viewer.admin.getSegment.useSuspenseQuery({ segmentId });
  const { segment } = data;
  const { data: featuresData } = trpc.viewer.admin.listFeatures.useQuery({});
  const features = featuresData?.features;

  const mutation = trpc.viewer.admin.updateSegment.useMutation({
    onSuccess: async () => {
      showToast("Segment updated successfully", "success");

      if (pathname !== null) {
        router.replace(pathname.replace(`${segmentId}/edit`, ""));
      }
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error adding this segment.", "error");
    },
  });

  return (
    <>
      <Meta title="Edit segment" description="Here you can edit a segment" />
      <NoSSR>
        <Suspense fallback={<SkeletonLoader />}>
          <SegmentForm
            submitLabel="Edit segment"
            onSubmit={async (values) => {
              console.log(values);
              const parser = getParserWithGeneric(segmentBodySchema);
              const parsedValues = parser(values);
              console.log(parsedValues);
              mutation.mutate({ ...parsedValues, segmentId });
            }}
            defaultValues={segment}
            features={features?.map((feature) => ({
              value: feature.slug,
              label: feature.slug,
            }))}
          />
        </Suspense>
      </NoSSR>
    </>
  );
};
