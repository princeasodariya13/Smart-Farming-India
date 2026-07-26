"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export type MarketplaceEvent =
  | {
      type: "booking_request";
      bookingId: string;
      productId: string;
      productName: string;
      buyerName: string;
      message: string;
      startDate?: string;
      endDate?: string;
    }
  | {
      type: "booking_approved" | "booking_rejected";
      bookingId: string;
      productId: string;
      productName: string;
      status: string;
      message: string;
    }
  | { type: "connected"; userId: string };

interface UseMarketplaceEventsOptions {
  onEvent: (event: MarketplaceEvent) => void;
}

export function useMarketplaceEvents({ onEvent }: UseMarketplaceEventsOptions) {
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      if (esRef.current) {
        esRef.current.close();
      }

      const es = new EventSource("/api/marketplace/events");
      esRef.current = es;

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as MarketplaceEvent;
          if (data.type !== "connected") {
            onEventRef.current(data);
          }
        } catch (_) {}
      };

      es.onerror = () => {
        es.close();
        // Reconnect after 5s
        retryTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      clearTimeout(retryTimeout);
      esRef.current?.close();
    };
  }, []);
}
