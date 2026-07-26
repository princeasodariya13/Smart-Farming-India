"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

interface Booking {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  startDate: string;
  endDate: string;
  createdAt: string;
  product: {
    name: string;
    price: number;
    priceUnit: string;
    image: string;
    seller: string;
    location: string;
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/marketplace/my-bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const res = await fetch(`/api/marketplace/book/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  useEffect(() => {
    fetchBookings();
    // Re-fetch periodically or we can rely on SSE for updates in the future
    const interval = setInterval(fetchBookings, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && bookings.length === 0) {
    return null;
  }

  if (bookings.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 rounded-[28px] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
        My Rental Bookings
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {bookings.map((booking) => {
            const sellerName = booking.product.seller.split('||')[0];
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const isSingleDay = start.getTime() === end.getTime();

            return (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface"
              >
                <div className="relative h-32 w-full bg-surface-container">
                  <Image
                    src={booking.product.image}
                    alt={booking.product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-surface/90 px-2.5 py-1 backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {booking.status === "pending" && (
                        <><Clock size={12} className="text-orange-500" /> <span className="text-orange-600">Pending</span></>
                      )}
                      {booking.status === "approved" && (
                        <><CheckCircle size={12} className="text-green-500" /> <span className="text-green-600">Approved</span></>
                      )}
                      {booking.status === "rejected" && (
                        <><XCircle size={12} className="text-red-500" /> <span className="text-red-600">Rejected</span></>
                      )}
                      {booking.status === "cancelled" && (
                        <><XCircle size={12} className="text-on-surface-variant" /> <span className="text-on-surface-variant">Cancelled</span></>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 flex-1">
                  <div>
                    <h3 className="font-bold text-label-lg text-on-surface line-clamp-1">
                      {booking.product.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      ₹{booking.product.price.toLocaleString("en-IN")} {booking.product.priceUnit}
                    </p>
                  </div>

                  <div className="mt-auto space-y-2 rounded-xl bg-surface-container-low p-3">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Calendar size={14} className="text-primary shrink-0" />
                      <span className="font-medium text-on-surface">
                        {isSingleDay 
                          ? start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                        }
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-on-surface block">{sellerName}</span>
                        <span className="opacity-80">{booking.product.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cancel Button */}
                  {(booking.status === "pending" || booking.status === "approved") && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === "cancelled" && (
                    <div className="mt-3 w-full rounded-xl bg-surface-container py-2.5 text-center text-sm font-bold text-on-surface-variant">
                      Cancelled
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
