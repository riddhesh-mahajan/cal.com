"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";

import NoSSR from "@calcom/core/components/NoSSR";
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

export const SegmentAddView = () => {
  const pathname = usePathname();
  const router = useRouter();

  const mutation = trpc.viewer.admin.createSegment.useMutation({
    onSuccess: async () => {
      showToast("Segment added successfully", "success");

      if (pathname !== null) {
        router.replace(pathname.replace("/add", ""));
      }
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error adding this segment.", "error");
    },
  });

  return (
    <>
      <Meta title="Add segment" description="Here you can create new segment" />
      <NoSSR>
        <Suspense fallback={<SkeletonLoader />}>
          <SegmentForm
            submitLabel="Add segment"
            onSubmit={async (values) => {
              console.log(values);
              const parser = getParserWithGeneric(segmentBodySchema);
              const parsedValues = parser(values);
              console.log(parsedValues);
              mutation.mutate(parsedValues);
            }}
          />
        </Suspense>
      </NoSSR>
    </>
  );
};
