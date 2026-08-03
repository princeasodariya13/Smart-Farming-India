import { AtSign, BadgeCheck, MessageCircle, Reply, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityNotification } from "@/types/community";

const TYPE_ICON: Record<CommunityNotification["type"], LucideIcon> = {
  comment: MessageCircle,
  follower: UserPlus,
  reply: Reply,
  mention: AtSign,
  expert: BadgeCheck,
};

export function NotificationCard({ notification }: { notification: CommunityNotification }) {
  const Icon = TYPE_ICON[notification.type];
  return (
    <div className={cn("flex gap-3 rounded-lg p-2 -m-2", !notification.read && "bg-primary/5")}>
      <div className="relative shrink-0">
        <img src={notification.actorAvatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
          <Icon className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface">
          <span className="font-label-md">{notification.actor}</span> {notification.message}
        </p>
        <p className="text-label-sm text-outline">{notification.postedAt}</p>
      </div>
      {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
    </div>
  );
}

export function NotificationsPanel({ notifications, onMarkAllRead }: { notifications: CommunityNotification[], onMarkAllRead?: () => void }) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-headline-md text-lg font-bold text-on-surface">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button onClick={onMarkAllRead} className="text-label-md font-label-md text-primary hover:underline">Mark all read</button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
}
