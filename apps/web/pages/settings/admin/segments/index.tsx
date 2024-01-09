"use client";

import { SegmentListingView } from "@calcom/features/segment/pages/segment-listing-view";

import PageWrapper from "@components/PageWrapper";
import { getLayout } from "@components/auth/layouts/AdminLayout";

const SegmentsPage = () => <SegmentListingView />;

SegmentsPage.getLayout = getLayout;
SegmentsPage.PageWrapper = PageWrapper;

export default SegmentsPage;
