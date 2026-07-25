"use client";

import { Smartphone, CreditCard, Landmark, Star } from "lucide-react";
import type { PaymentMethod } from "@/types/profile";

interface PaymentCardProps {
  methods?: PaymentMethod[];
}

const iconMap: Record<PaymentMethod["type"], typeof Smartphone> = {
  upi: Smartphone,
  credit_card: CreditCard,
  debit_card: CreditCard,
  bank_account: Landmark,
};

const defaultMethods: PaymentMethod[] = [
  { id: "p1", type: "upi", label: "UPI", maskedDetail: "rajesh****@okhdfc", isDefault: true },
  { id: "p2", type: "credit_card", label: "Credit Card", maskedDetail: "•••• •••• •••• 4821" },
  { id: "p3", type: "bank_account", label: "Bank Account", maskedDetail: "HDFC ••••6712" },
];

export default function PaymentCard({ methods = defaultMethods }: PaymentCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Saved Payment Methods</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {methods.length === 0 ? (
          <div className="col-span-full py-6 text-center text-on-surface-variant bg-surface-container-low/50 border border-dashed border-outline-variant/60 rounded-xl">
            No saved payment methods.
          </div>
        ) : methods.map((m) => {
          const Icon = iconMap[m.type];
          return (
            <div
              key={m.id}
              className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={17} />
                </span>
                {m.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Star size={11} fill="currentColor" /> Default
                  </span>
                )}
              </div>
              <p className="font-bold text-sm text-on-surface mb-1">{m.label}</p>
              <p className="text-xs text-on-surface-variant font-mono">{m.maskedDetail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
