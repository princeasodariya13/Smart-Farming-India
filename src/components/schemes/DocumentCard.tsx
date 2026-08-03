"use client";

import {
  FileText,
  Landmark,
  Wallet,
  ScrollText,
  IdCard,
  User,
  FileBadge,
} from "lucide-react";
import type { RequiredDocument } from "@/types/schemes";

interface DocumentCardProps {
  documents?: RequiredDocument[];
}

const iconMap: Record<string, typeof FileText> = {
  aadhaar: IdCard,
  pan: FileBadge,
  land: Landmark,
  passbook: Wallet,
  income: ScrollText,
  caste: ScrollText,
  photo: User,
  file: FileText,
};

const defaultDocuments: RequiredDocument[] = [
  { id: "d1", name: "Aadhaar Card (UIDAI)", icon: "aadhaar", status: "verified" },
  { id: "d2", name: "Permanent Account Number (PAN)", icon: "pan", status: "verified" },
  { id: "d3", name: "7/12 Land Extract (RoR)", icon: "land", status: "verified" },
  { id: "d4", name: "Bank Passbook (DBT Linked)", icon: "passbook", status: "pending" },
  { id: "d5", name: "Income Certificate (Current Year)", icon: "income", status: "pending" },
  { id: "d6", name: "Recent Passport Photograph", icon: "photo", status: "pending" },
];

export default function DocumentCard({ documents = defaultDocuments }: DocumentCardProps) {
  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-3xl border border-outline-variant/60 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-on-surface">Required Documents</h2>
        <p className="text-xs text-on-surface-variant mt-1 font-medium">Keep these documents ready for scheme applications.</p>
      </div>

      <div className="flex flex-col gap-3">
        {documents.map((doc) => {
          const DocIcon = iconMap[doc.icon] ?? FileText;
          
          return (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <DocIcon size={20} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-on-surface leading-tight mb-1">{doc.name}</h4>
                <p className="text-xs text-on-surface-variant font-medium">Mandatory Document</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
