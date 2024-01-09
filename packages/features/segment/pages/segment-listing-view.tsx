import { Suspense } from "react";

import NoSSR from "@calcom/core/components/NoSSR";
import { Meta, SkeletonText, SkeletonContainer, Button } from "@calcom/ui";

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

export const SegmentListingView = () => {
  return (
    <>
      <Meta
        title="Segments"
        description="Here you can manage your user segments."
        CTA={
          <div className="mt-4 space-x-5 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button href="/settings/admin/segments/add">Add segment</Button>
          </div>
        }
      />
      <NoSSR>
        <Suspense fallback={<SkeletonLoader />}>
          {/* <FlagAdminList /> */}
          <h1>Riddhesh</h1>
        </Suspense>
      </NoSSR>
    </>
  );
};
