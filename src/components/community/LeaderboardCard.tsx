import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types/community";

const RANK_STYLES: Record<number, string> = {
  1: "bg-amber-100 text-amber-800",
  2: "bg-slate-100 text-slate-700",
  3: "bg-orange-100 text-orange-800",
};

export function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-label-sm font-bold",
          RANK_STYLES[entry.rank] ?? "bg-surface-container text-on-surface-variant"
        )}
      >
        {entry.rank}
      </span>
      {entry.avatarUrl ? (
        <img src={entry.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover border border-outline-variant/30" />
      ) : (
        <div className="h-9 w-9 shrink-0 rounded-full border border-outline-variant/30 bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold tracking-wider">
          {entry.name ? entry.name.substring(0, 2).toUpperCase() : "U"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h4 className="truncate text-label-md font-label-md text-on-surface">{entry.name}</h4>
          {entry.badge && <Award className="h-3.5 w-3.5 shrink-0 text-primary" aria-label={entry.badge} />}
        </div>
        <p className="text-label-sm text-outline">{entry.helpfulAnswers} helpful answers</p>
      </div>
      <span className="shrink-0 text-label-md font-label-md text-on-surface">
        {entry.score.toLocaleString()}
      </span>
    </div>
  );
}

export function LeaderboardPanel({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 sm:p-6">
      <h3 className="mb-5 font-headline-md text-lg font-bold text-on-surface">Top Contributors</h3>
      <div className="flex flex-col gap-4">
        {entries.map((e) => (
          <LeaderboardCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
}
