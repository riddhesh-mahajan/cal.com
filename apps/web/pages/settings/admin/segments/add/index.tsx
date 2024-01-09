"use client";

import { SegmentAddView } from "@calcom/features/segment/pages/segments-add-view";

import PageWrapper from "@components/PageWrapper";
import { getLayout } from "@components/auth/layouts/AdminLayout";

const AddSegmentPage = () => <SegmentAddView />;

AddSegmentPage.getLayout = getLayout;
AddSegmentPage.PageWrapper = PageWrapper;

export default AddSegmentPage;
