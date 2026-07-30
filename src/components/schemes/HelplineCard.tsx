"use client";

import { Phone, Mail, MessageCircle, MapPin, Download } from "lucide-react";
import type { HelplineInfo } from "@/types/schemes";

interface HelplineCardProps {
  info?: HelplineInfo;
  onLiveChat?: () => void;
  onDownloadGuidelines?: () => void;
}

const defaultInfo: HelplineInfo = {
  tollFreeNumber: "1800-180-1551",
  email: "support@smartfarmingindia.gov.in",
  nearestOffice: "District Agriculture Office, Ahmedabad — 3.1 km away",
};

export default function HelplineCard({
  info = defaultInfo,
  onLiveChat,
  onDownloadGuidelines,
}: HelplineCardProps) {
  const items = [
    { icon: Phone, label: "Toll-Free Helpline", value: info.tollFreeNumber },
    { icon: Mail, label: "Email Support", value: info.email },
    { icon: MapPin, label: "Nearby Agriculture Office", value: info.nearestOffice },
  ];

  return (
    <div className="bg-surface-glass backdrop-blur-xl rounded-2xl border border-outline-variant/60 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-on-surface mb-6">Government Helpline</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-xs text-on-surface-variant">{label}</p>
              <p className="text-sm font-semibold text-on-surface">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onLiveChat}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
        >
          <MessageCircle size={17} /> Start Live Chat
        </button>
        <button
          type="button"
          onClick={onDownloadGuidelines}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-outline-variant rounded-xl font-semibold text-sm hover:bg-surface-container-low transition-colors"
        >
          <Download size={17} /> Download Guidelines
        </button>
      </div>
    </div>
  );
}
