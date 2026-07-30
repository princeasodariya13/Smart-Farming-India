"use client";

import {
  FileText,
  Landmark,
  Wallet,
  ScrollText,
  IdCard,
  User,
  Sprout,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
} from "lucide-react";
import type { RequiredDocument } from "@/types/schemes";

interface DocumentCardProps {
  documents?: RequiredDocument[];
  onUpload?: (id: string) => void;
}

const iconMap: Record<string, typeof FileText> = {
  aadhaar: IdCard,
  pan: FileText,
  land: Landmark,
  passbook: Wallet,
  income: ScrollText,
  caste: ScrollText,
  photo: User,
  crop: Sprout,
};

const statusConfig: Record<
  RequiredDocument["status"],
  { icon: typeof CheckCircle2; style: string; label: string }
> = {
  verified: { icon: CheckCircle2, style: "text-primary", label: "Verified" },
  uploaded: { icon: Clock, style: "text-tertiary", label: "Under Review" },
  pending: { icon: Upload, style: "text-on-surface-variant", label: "Not Uploaded" },
  rejected: { icon: XCircle, style: "text-error", label: "Rejected" },
};

const defaultDocuments: RequiredDocument[] = [
  { id: "d1", name: "Aadhaar Card", icon: "aadhaar", status: "verified" },
  { id: "d2", name: "PAN Card", icon: "pan", status: "verified" },
  { id: "d3", name: "Land Records", icon: "land", status: "verified" },
  { id: "d4", name: "Bank Passbook", icon: "passbook", status: "uploaded" },
  { id: "d5", name: "Income Certificate", icon: "income", status: "pending" },
  { id: "d6", name: "Caste Certificate", icon: "caste", status: "pending" },
  { id: "d7", name: "Passport Photo", icon: "photo", status: "verified" },
  { id: "d8", name: "Crop Details", icon: "crop", status: "rejected" },
];

export default function DocumentCard({ documents = defaultDocuments, onUpload }: DocumentCardProps) {
  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-2xl border border-outline-variant/60 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-on-surface mb-6">Required Documents</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {documents.map((doc) => {
          const DocIcon = iconMap[doc.icon] ?? FileText;
          const status = statusConfig[doc.status];
          const StatusIcon = status.icon;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => onUpload?.(doc.id)}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-outline-variant/50 hover:border-primary/40 transition-colors bg-surface-container-low"
            >
              <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <DocIcon size={19} />
              </span>
              <span className="text-xs font-semibold text-on-surface">{doc.name}</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold ${status.style}`}>
                <StatusIcon size={12} /> {status.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
