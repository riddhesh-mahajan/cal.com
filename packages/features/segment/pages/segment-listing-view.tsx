import { Suspense } from "react";

import NoSSR from "@calcom/core/components/NoSSR";
import { trpc } from "@calcom/trpc";
import { Meta, SkeletonText, SkeletonContainer, Button } from "@calcom/ui";
import { DropdownActions, Table } from "@calcom/ui";
import { Edit, Trash } from "@calcom/ui/components/icon";

const { Cell, ColumnTitle, Header, Row } = Table;

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
  const { data, isFetching } = trpc.viewer.admin.listSegments.useQuery({});
  const segments = data?.segments;

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
          {isFetching && (
            <div className="flex justify-center">
              <div className="mt-8">
                <SkeletonText className="h-8 w-32" />
              </div>
            </div>
          )}

          {!isFetching && segments?.length === 0 && (
            <div className="flex justify-center">
              <div className="mt-8">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-default text-center">You don't have any segments yet.</p>
              </div>
            </div>
          )}

          {!isFetching && segments?.length !== 0 && (
            <Table>
              <Header>
                <ColumnTitle widthClassNames="w-auto">Name</ColumnTitle>
                <ColumnTitle widthClassNames="w-auto">
                  <span className="sr-only">Edit</span>
                </ColumnTitle>
              </Header>

              <tbody className="divide-subtle divide-y rounded-md">
                {segments?.map((singleSegmentData: any, index: number) => (
                  <Row key={index}>
                    <Cell>{singleSegmentData.name}</Cell>

                    <Cell widthClassNames="w-auto">
                      <div className="flex w-full justify-end">
                        <DropdownActions
                          actions={[
                            {
                              id: "edit",
                              label: "Edit",
                              href: `/settings/admin/segments/${singleSegmentData.id}/edit`,
                              icon: Edit,
                            },
                            {
                              id: "delete",
                              label: "Delete",
                              color: "destructive",
                              onClick: () => {
                                console.log("Delete clicked");
                              },
                              icon: Trash,
                            },
                          ]}
                        />
                      </div>
                    </Cell>
                  </Row>
                ))}
              </tbody>
            </Table>
          )}
        </Suspense>
      </NoSSR>
    </>
  );
};
