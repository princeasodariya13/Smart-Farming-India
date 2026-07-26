export type SchemeStatus = "open" | "closing_soon" | "closed";
export type DocumentStatus = "uploaded" | "verified" | "pending" | "rejected";
export type ApplicationStage =
  | "submitted"
  | "under_review"
  | "verification"
  | "approved"
  | "benefit_released";
export type AnnouncementType =
  | "new_scheme"
  | "reopened"
  | "deadline_extended"
  | "subsidy_increased"
  | "policy_update";

export interface Scheme {
  id: string;
  categoryId?: string;
  state?: string;
  logoUrl: string;
  name: string;
  ministry: string;
  description: string;
  benefit: string;
  deadline: string;
  status: SchemeStatus;
  eligibilitySummary: string;
  applyUrl?: string;
  saved?: boolean;
}

export interface SchemeCategory {
  id: string;
  label: string;
  icon: string;
  schemeCount: number;
}

export interface EligibilityCriteria {
  state: string;
  district: string;
  farmerType: string;
  landSize: string;
  cropType: string;
  annualIncome: string;
  category: string;
  gender: string;
}

export interface RecommendedScheme {
  id: string;
  name: string;
  icon: string;
  matchPercentage: number;
  reason: string;
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  date: string;
}

export interface ApplicationTrackerData {
  schemeName: string;
  applicationId: string;
  currentStage: ApplicationStage;
  nextDisbursement?: string;
  stages: { stage: ApplicationStage; label: string; date?: string; note?: string }[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  icon: string;
  status: DocumentStatus;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface HelplineInfo {
  tollFreeNumber: string;
  email: string;
  nearestOffice: string;
  guidelinesUrl?: string;
}
