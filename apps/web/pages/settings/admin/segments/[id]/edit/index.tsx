"use client";

import { SegmentEditPage } from "@calcom/features/segment/pages/segments-edit-view";

import PageWrapper from "@components/PageWrapper";
import { getLayout } from "@components/auth/layouts/AdminLayout";

const AddSegmentPage = () => <SegmentEditPage />;

AddSegmentPage.getLayout = getLayout;
AddSegmentPage.PageWrapper = PageWrapper;

export default AddSegmentPage;
