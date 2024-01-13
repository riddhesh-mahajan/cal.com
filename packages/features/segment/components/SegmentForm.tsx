// eslint-disable-next-line no-restricted-imports
import { noop } from "lodash";
import { Controller, useForm } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { SegmentUser, User } from "@calcom/prisma/client";
import { Button, Form, Label, Select, TextAreaField, TextField } from "@calcom/ui";

type Option<T extends string | number = string> = {
  value: T;
  label: string;
};

type OptionValues = {
  name: string;
  selection: Option;
  coverage: number;
  coverageUnit: Option;
  team: Option;
  emails: string[];
  feature: Option;
};

type FormValues = OptionValues;

export const SegmentForm = ({
  defaultValues,
  localeProp = "en",
  onSubmit = noop,
  submitLabel = "save",
  features = [],
}: {
  defaultValues?: any;
  localeProp?: string;
  onSubmit: (data: FormValues) => void;
  submitLabel?: string;
  features?: Option[];
}) => {
  const { t } = useLocale();

  const selectionOptions: Option[] = [
    { value: "RANDOM", label: t("random") },
    { value: "CUSTOM", label: t("custom") },
    { value: "TARGETED", label: t("targeted") },
  ];

  const coverageTypeOptions: Option[] = [
    { value: "PERCENT", label: t("percent") },
    { value: "USERS", label: t("users") },
  ];

  const teamOptions: Option[] = [
    { value: "ALL", label: t("all") },
    { value: "NO_TEAMS", label: t("no_team") },
    { value: "ATLEAST_ONE_TEAM", label: t("at_least_one_team") },
  ];

  const form = useForm<FormValues>({
    defaultValues: {
      name: defaultValues?.name,

      selection: {
        value: defaultValues?.selection || selectionOptions[0].value,
        label:
          selectionOptions.find((option) => option.value === defaultValues?.selection)?.label ||
          selectionOptions[0].label,
      },

      coverage: defaultValues?.coverage || 100,
      coverageUnit: {
        value: defaultValues?.coverageUnit || coverageTypeOptions[0].value,
        label:
          coverageTypeOptions.find((option) => option.value === defaultValues?.coverageUnit)?.label ||
          coverageTypeOptions[0].label,
      },

      team: {
        value: defaultValues?.teamFilter || teamOptions[0].value,
        label:
          teamOptions.find((option) => option.value === defaultValues?.teamFilter)?.label ||
          teamOptions[0].label,
      },

      emails:
        defaultValues?.segmentUsers?.map(
          (segmentUser: SegmentUser & { user: User }) => segmentUser.user.email
        ) || [],
      feature: {
        value: defaultValues?.featureId,
        label: defaultValues?.featureId,
      },
    },
  });

  const selectionValue = form.watch("selection");

  return (
    <Form form={form} className="space-y-4" handleSubmit={onSubmit}>
      <TextField label="Name" placeholder="example" required {...form.register("name")} />

      <Controller
        name="feature"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <div>
            <Label className="text-default font-medium" htmlFor="feature">
              {t("feature")}
            </Label>
            <Select<{ label: string; value: string }> value={value} options={features} onChange={onChange} />
          </div>
        )}
      />

      <Controller
        name="selection"
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <div>
            <Label className="text-default font-medium" htmlFor="selection">
              {t("selection")}
            </Label>
            <Select<{ label: string; value: string }>
              value={value}
              options={selectionOptions}
              onChange={onChange}
            />
          </div>
        )}
      />

      {selectionValue.value === "RANDOM" && (
        <div className="grid grid-cols-2 gap-4">
          <TextField
            type="number"
            label="Coverage"
            placeholder="Coverage"
            required
            {...form.register("coverage", { valueAsNumber: true })}
          />

          <Controller
            name="coverageUnit"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Label className="text-default font-medium" htmlFor="coverageUnit">
                  {t("coverage_unit")}
                </Label>
                <Select<{ label: string; value: string }>
                  value={value}
                  options={coverageTypeOptions}
                  onChange={onChange}
                />
              </div>
            )}
          />
        </div>
      )}

      {selectionValue.value === "TARGETED" && (
        <Controller
          name="team"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label className="text-default font-medium" htmlFor="team">
                {t("team")}
              </Label>
              <Select<{ label: string; value: string }>
                value={value}
                options={teamOptions}
                onChange={onChange}
              />
            </div>
          )}
        />
      )}

      {selectionValue.value === "CUSTOM" && (
        <Controller
          name="emails"
          control={form.control}
          rules={{
            required: t("enter_email_or_username"),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextAreaField
                name="emails"
                label={t("invite_via_email")}
                rows={4}
                autoCorrect="off"
                placeholder="john@doe.com, alex@smith.com"
                required
                value={value}
                onChange={(e) => {
                  const targetValues = e.target.value.split(",");
                  const emails =
                    targetValues.length === 1
                      ? targetValues[0].trim().toLocaleLowerCase()
                      : targetValues.map((email) => email.trim().toLocaleLowerCase());

                  return onChange(emails);
                }}
              />
              {error && <span className="text-sm text-red-800">{error.message}</span>}
            </>
          )}
        />
      )}

      <br />
      <Button type="submit" color="primary">
        {t(submitLabel)}
      </Button>
    </Form>
  );
};
