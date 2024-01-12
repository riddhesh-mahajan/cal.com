/**
 * Right now we only support boolean flags.
 * Maybe later on we can add string variants or numeric ones
 **/
type AppFlagStructure = {
  enabled: boolean;
  status: string;
};
export type AppFlags = {
  "calendar-cache": AppFlagStructure;
  emails: AppFlagStructure;
  insights: AppFlagStructure;
  teams: AppFlagStructure;
  webhooks: AppFlagStructure;
  workflows: AppFlagStructure;
  "managed-event-types": AppFlagStructure;
  organizations: AppFlagStructure;
  "email-verification": AppFlagStructure;
  "google-workspace-directory": AppFlagStructure;
  "disable-signup": AppFlagStructure;
};
