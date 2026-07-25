"use client";

import { User, Pencil } from "lucide-react";
import type { PersonalInfo } from "@/types/profile";

interface PersonalInfoCardProps {
  info?: PersonalInfo;
  onEdit?: () => void;
}

const defaultInfo: PersonalInfo = {
  fullName: "Rajesh Kumar",
  mobile: "+91 98765 43210",
  email: "rajesh.k@kisanadmin.in",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-on-surface-variant mb-1.5">{label}</label>
      <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface font-medium">
        {value}
      </div>
    </div>
  );
}

export default function PersonalInfoCard({ info = defaultInfo, onEdit }: PersonalInfoCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <User size={20} className="text-primary" /> Personal Information
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
        >
          <Pencil size={14} /> Edit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name" value={info.fullName} />
        <Field label="Mobile Number" value={info.mobile} />
        <Field label="Email Address" value={info.email} />
      </div>
    </div>
  );
}
