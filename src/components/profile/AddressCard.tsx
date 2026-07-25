"use client";

import { Home, Sprout, Warehouse, Star } from "lucide-react";
import type { Address } from "@/types/profile";

interface AddressCardProps {
  addresses?: Address[];
}

const iconMap: Record<Address["type"], typeof Home> = {
  home: Home,
  farm: Sprout,
  warehouse: Warehouse,
};

const defaultAddresses: Address[] = [
  {
    id: "a1",
    type: "home",
    label: "Home",
    fullAddress: "House No. 22, Green Fields Colony, Karnal, Haryana 132001",
    isDefault: true,
  },
  {
    id: "a2",
    type: "farm",
    label: "Farm",
    fullAddress: "Khasra #412/1, Nilokheri, Karnal, Haryana 132117",
  },
  {
    id: "a3",
    type: "warehouse",
    label: "Warehouse",
    fullAddress: "Storage Unit 4, Grain Market Road, Karnal, Haryana 132001",
  },
];

export default function AddressCard({ addresses = defaultAddresses }: AddressCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface mb-6">Saved Addresses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-full py-6 text-center text-on-surface-variant bg-surface-container-low/50 border border-dashed border-outline-variant/60 rounded-xl">
            No saved addresses.
          </div>
        ) : addresses.map((addr) => {
          const Icon = iconMap[addr.type];
          return (
            <div
              key={addr.id}
              className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={17} />
                </span>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Star size={11} fill="currentColor" /> Default
                  </span>
                )}
              </div>
              <p className="font-bold text-sm text-on-surface mb-1">{addr.label}</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{addr.fullAddress}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
