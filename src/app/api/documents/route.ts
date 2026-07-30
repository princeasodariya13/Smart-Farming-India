import { NextResponse } from 'next/server';
import type { RequiredDocument } from '@/types/schemes';

export async function GET() {
  // Simulate fetching a real user's required documents for their active scheme applications
  const activeDocuments: RequiredDocument[] = [
    { id: "doc-aadhaar", name: "Aadhaar Card", icon: "aadhaar", status: "verified" },
    { id: "doc-pan", name: "PAN Card", icon: "pan", status: "verified" },
    { id: "doc-land", name: "7/12 Land Extract", icon: "land", status: "verified" },
    { id: "doc-bank", name: "Bank Account Proof", icon: "passbook", status: "uploaded" },
    { id: "doc-income", name: "Income Certificate (Current Year)", icon: "income", status: "pending" },
    { id: "doc-photo", name: "Recent Passport Photo", icon: "photo", status: "verified" },
  ];

  return NextResponse.json({ success: true, documents: activeDocuments });
}
