"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, XCircle, X } from "lucide-react";
import { useMarketplaceEvents, type MarketplaceEvent } from "@/hooks/useMarketplaceEvents";

interface BookingNotification {
  id: string;            // bookingId
  productId: string;
  productName: string;
  buyerName: string;
  message: string;
  startDate?: string;
  endDate?: string;
  type: "incoming";      // seller sees these
}

interface StatusNotification {
  id: string;            // bookingId
  productName: string;
  status: "approved" | "rejected";
  message: string;
  type: "status";        // buyer sees these
}

type Notification = BookingNotification | StatusNotification;

// Shared booking status map — keyed by productId so ProductModal can read it
let _statusListeners: Array<(map: Record<string, string>) => void> = [];
let _bookingStatusMap: Record<string, string> = {};
export function subscribeBookingStatus(fn: (map: Record<string, string>) => void) {
  _statusListeners.push(fn);
  return () => { _statusListeners = _statusListeners.filter(l => l !== fn); };
}
function updateBookingStatus(productId: string, status: string) {
  _bookingStatusMap = { ..._bookingStatusMap, [productId]: status };
  _statusListeners.forEach(fn => fn(_bookingStatusMap));
}
export function getBookingStatusMap() {
  return _bookingStatusMap;
}

export default function MarketplaceNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleEvent = useCallback((event: MarketplaceEvent) => {
    if (event.type === "booking_request") {
      setNotifications(prev => {
        if (prev.some(n => n.id === event.bookingId)) return prev;
        return [
          {
            id: event.bookingId,
            productId: event.productId,
            productName: event.productName,
            buyerName: event.buyerName,
            message: event.message,
            startDate: event.startDate,
            endDate: event.endDate,
            type: "incoming",
          },
          ...prev,
        ];
      });
    } else if (event.type === "booking_approved" || event.type === "booking_rejected") {
      setNotifications(prev => {
        // Also remove any 'incoming' notification with this ID if it exists
        const filtered = prev.filter(n => n.id !== event.bookingId);
        return [
          {
            id: event.bookingId,
            productName: event.productName,
            status: event.type === "booking_approved" ? "approved" : "rejected",
            message: event.message,
            type: "status",
          },
          ...filtered,
        ];
      });
      // Broadcast status so Marketplace product cards update immediately
      updateBookingStatus(event.productId, event.status);
    }
  }, []);

  useMarketplaceEvents({ onEvent: handleEvent });

  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const handleAction = async (
    bookingId: string,
    action: "approve" | "reject"
  ) => {
    setActionLoading(bookingId + action);
    try {
      const res = await fetch(`/api/marketplace/book/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        dismiss(bookingId);
      }
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.28 }}
            className={`flex items-start justify-between rounded-xl border p-4 shadow-sm ${
              notif.type === "incoming"
                ? "border-primary/20 bg-primary/10"
                : notif.type === "status" && notif.status === "approved"
                ? "border-green-500/20 bg-green-500/10"
                : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  notif.type === "incoming"
                    ? "bg-primary/20 text-primary"
                    : notif.type === "status" && notif.status === "approved"
                    ? "bg-green-500/20 text-green-600"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {notif.type === "incoming" ? (
                  <Bell size={20} />
                ) : notif.status === "approved" ? (
                  <CheckCircle size={20} />
                ) : (
                  <XCircle size={20} />
                )}
              </div>
              <div>
                <p className="font-bold text-on-surface">
                  {notif.type === "incoming"
                    ? "New Booking Request"
                    : notif.status === "approved"
                    ? "Booking Approved ✅"
                    : "Booking Rejected ❌"}
                </p>
                <p className="text-label-md text-on-surface-variant">
                  {notif.message}
                </p>
                {notif.type === "incoming" && notif.startDate && (
                  <p className="text-[11px] font-semibold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1 border border-primary/20">
                    {notif.endDate && notif.startDate !== notif.endDate 
                      ? `Requested: ${new Date(notif.startDate).toLocaleDateString()} to ${new Date(notif.endDate).toLocaleDateString()}`
                      : `Requested: ${new Date(notif.startDate).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 shrink-0">
              {/* Seller actions */}
              {notif.type === "incoming" && (
                <>
                  <button
                    onClick={() => handleAction(notif.id, "approve")}
                    disabled={actionLoading !== null}
                    className="rounded-lg bg-green-600 px-3 py-2 text-label-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    {actionLoading === notif.id + "approve" ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(notif.id, "reject")}
                    disabled={actionLoading !== null}
                    className="rounded-lg bg-red-500 px-3 py-2 text-label-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
                  >
                    {actionLoading === notif.id + "reject" ? "..." : "Reject"}
                  </button>
                </>
              )}

              {/* Dismiss */}
              <button
                onClick={() => dismiss(notif.id)}
                className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-error"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
