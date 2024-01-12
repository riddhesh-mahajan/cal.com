import Link from "next/link";

import { FeatureStatus } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import type { RouterOutputs } from "@calcom/trpc/react";
import { Badge, List, ListItem, ListItemText, ListItemTitle, Select, Switch, showToast } from "@calcom/ui";

export const FlagAdminList = () => {
  const [data] = trpc.viewer.features.list.useSuspenseQuery();

  return (
    <List roundContainer noBorderTreatment>
      {data.map((flag) => (
        <ListItem key={flag.slug} rounded={false}>
          <div className="flex flex-1 flex-col">
            <ListItemTitle component="h3">
              {flag.slug}
              &nbsp;&nbsp;
              <Badge variant="green">{flag.type?.replace("_", " ")}</Badge>
            </ListItemTitle>
            <ListItemText component="p">{flag.description}</ListItemText>
          </div>

          <div className="flex px-4">
            {flag.enabled && flag.status === FeatureStatus.PILOTING && (
              <>
                {flag?.segment?.name ? (
                  <Link href="/settings/admin/segments">
                    <Badge variant="green">{flag.segment.name}</Badge>
                  </Link>
                ) : (
                  <Badge variant="red">No segment attached</Badge>
                )}
              </>
            )}
          </div>

          <div className="flex px-4">{flag.enabled && <FlagStatus flag={flag} />}</div>

          <div className="flex py-2">
            <FlagToggle flag={flag} />
          </div>
        </ListItem>
      ))}
    </List>
  );
};

type Flag = RouterOutputs["viewer"]["features"]["list"][number];

const FlagToggle = (props: { flag: Flag }) => {
  const {
    flag: { slug, enabled },
  } = props;
  const utils = trpc.useContext();
  const mutation = trpc.viewer.admin.toggleFeatureFlag.useMutation({
    onSuccess: () => {
      showToast("Flags successfully updated", "success");
      utils.viewer.features.list.fetch();
    },
  });
  return (
    <Switch
      defaultChecked={enabled}
      onCheckedChange={(checked) => {
        mutation.mutate({ slug, enabled: checked });
      }}
    />
  );
};

const FlagStatus = (props: { flag: Flag }) => {
  const {
    flag: { slug, status },
  } = props;

  const { data: FeatureStatusData } = trpc.viewer.features.listFlagStatuses.useQuery();

  const utils = trpc.useContext();
  const mutation = trpc.viewer.admin.updateFeatureStatus.useMutation({
    onSuccess: () => {
      showToast("Status successfully updated", "success");
      utils.viewer.features.list.fetch();
    },
  });
  return (
    <Select<{ label: string; value: string }>
      value={{ label: status, value: status }}
      options={
        FeatureStatusData ? Object.keys(FeatureStatusData).map((key) => ({ label: key, value: key })) : []
      }
      onChange={(value) => {
        mutation.mutate({ slug, status: value?.value || "" });
      }}
      className="min-w-48"
    />
  );
};
