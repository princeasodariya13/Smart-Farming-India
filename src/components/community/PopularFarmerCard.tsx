"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/contexts/NotificationContext";
import type { PopularFarmer } from "@/types/community";

export function PopularFarmerCard({ farmer }: { farmer: PopularFarmer }) {
  const [following, setFollowing] = useState(!!farmer.isFollowing);
  const { addNotification } = useNotification();

  const handleFollowToggle = () => {
    if (!following) {
      addNotification({
        title: "New Connection",
        message: `You are now following ${farmer.name}.`,
        type: "system",
      });
    }
    setFollowing((v) => !v);
  };

  return (
    <div className="flex items-center gap-3">
      {farmer.avatarUrl ? (
        <img src={farmer.avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover border border-outline-variant/30" />
      ) : (
        <div className="h-11 w-11 shrink-0 rounded-full border border-outline-variant/30 bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold tracking-wider">
          {farmer.name ? farmer.name.substring(0, 2).toUpperCase() : "F"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-label-md font-label-md text-on-surface">{farmer.name}</h4>
        <p className="truncate text-label-sm text-outline">
          {farmer.badge} · {farmer.followers.toLocaleString()} followers
        </p>
      </div>
      <button
        type="button"
        onClick={handleFollowToggle}
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
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:p-6">
      <h3 className="mb-5 font-headline-md text-lg font-bold text-on-surface">Popular Farmers</h3>
      <div className="flex flex-col gap-4">
        {farmers.map((f) => (
          <PopularFarmerCard key={f.id} farmer={f} />
        ))}
      </div>
    </div>
  );
}
