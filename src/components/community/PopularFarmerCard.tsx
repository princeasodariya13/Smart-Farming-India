"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PopularFarmer } from "@/types/community";

export function PopularFarmerCard({ farmer }: { farmer: PopularFarmer }) {
  const [following, setFollowing] = useState(!!farmer.isFollowing);

  return (
    <div className="flex items-center gap-3">
      <img src={farmer.avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-label-md font-label-md text-on-surface">{farmer.name}</h4>
        <p className="truncate text-label-sm text-outline">
          {farmer.badge} · {farmer.followers.toLocaleString()} followers
        </p>
      </div>
      <button
        type="button"
        onClick={() => setFollowing((v) => !v)}
        className={cn(
          "shrink-0 rounded-full border px-3 py-1.5 text-label-sm transition-colors",
          following
            ? "border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
            : "border-primary text-primary hover:bg-primary/5"
        )}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export function PopularFarmersPanel({ farmers }: { farmers: PopularFarmer[] }) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h3 className="mb-5 font-headline-md text-lg font-bold text-on-surface">Popular Farmers</h3>
      <div className="flex flex-col gap-4">
        {farmers.map((f) => (
          <PopularFarmerCard key={f.id} farmer={f} />
        ))}
      </div>
    </div>
  );
}
