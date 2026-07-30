import { NextResponse } from 'next/server';
import type { ApplicationTrackerData } from '@/types/schemes';

export async function GET() {
  // Simulate fetching a real user's active scheme applications from a database
  const activeApplications: ApplicationTrackerData[] = [
    {
      schemeName: "Pradhan Mantri Krishi Sinchayee Yojana",
      applicationId: "SFI-88291-K",
      currentStage: "verification",
      nextDisbursement: "Pending Review",
      stages: [
        {
          stage: "submitted",
          label: "Application Submitted",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          note: "Documents uploaded and signature verified.",
        },
        { 
          stage: "under_review", 
          label: "Under Review", 
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        },
        {
          stage: "verification",
          label: "Verification",
          date: new Date(Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          note: "District Agricultural Officer verification in progress.",
        },
        { stage: "approved", label: "Approved" },
        { stage: "benefit_released", label: "Benefit Released", note: "Expected next month" },
      ],
    }
  ];

  return NextResponse.json({ success: true, applications: activeApplications });
}
