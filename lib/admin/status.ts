import { APPLICATION_STATUSES, QUERY_STATUSES } from "@/lib/db/schema";

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type QueryStatus = (typeof QUERY_STATUSES)[number];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "Pending review",
  shortlisted: "Shortlisted",
  confirmed: "Confirmed",
  rejected: "Not selected",
};

export { APPLICATION_STATUSES, QUERY_STATUSES };
