"use client";

import type { Order } from "@/types/profile";

interface OrdersTableProps {
  orders?: Order[];
  onView?: (id: string) => void;
}

const statusStyles: Record<Order["status"], string> = {
  delivered: "bg-secondary-container text-on-secondary-container",
  shipped: "bg-primary/10 text-primary",
  processing: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  cancelled: "bg-error-container text-error",
};

const paymentStyles: Record<Order["payment"], string> = {
  paid: "text-primary",
  pending: "text-tertiary",
  failed: "text-error",
};

const defaultOrders: Order[] = [
  {
    id: "ORD-8841",
    product: "DAP Fertilizer (2 bags)",
    status: "delivered",
    amount: 2450,
    payment: "paid",
    date: "22 Jul 2026",
  },
  {
    id: "ORD-8790",
    product: "Neem Oil Pesticide",
    status: "shipped",
    amount: 690,
    payment: "paid",
    date: "18 Jul 2026",
  },
  {
    id: "ORD-8712",
    product: "Drip Irrigation Kit",
    status: "processing",
    amount: 5200,
    payment: "pending",
    date: "12 Jul 2026",
  },
  {
    id: "ORD-8650",
    product: "Hybrid Wheat Seeds (50kg)",
    status: "cancelled",
    amount: 3100,
    payment: "failed",
    date: "3 Jul 2026",
  },
];

export default function OrdersTable({ orders = defaultOrders, onView }: OrdersTableProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm overflow-x-auto">
      <h2 className="text-lg font-bold text-on-surface mb-6">Recent Orders</h2>
      <table className="w-full text-sm min-w-[640px]">
        <caption className="sr-only">Recent marketplace orders</caption>
        <thead>
          <tr className="text-left text-xs uppercase text-on-surface-variant border-b border-outline-variant/50">
            <th scope="col" className="py-2 pr-4 font-semibold">Product</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Order ID</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Amount</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Payment</th>
            <th scope="col" className="py-2 pr-4 font-semibold">Date</th>
            <th scope="col" className="py-2 pr-4 font-semibold text-right">Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-on-surface-variant border-b border-outline-variant/30">
                No recent orders found.
              </td>
            </tr>
          ) : orders.map((order) => (
            <tr key={order.id} className="border-b border-outline-variant/30 last:border-0">
              <td className="py-3 pr-4 font-medium text-on-surface">{order.product}</td>
              <td className="py-3 pr-4 text-on-surface-variant">{order.id}</td>
              <td className="py-3 pr-4">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3 pr-4 font-semibold">₹{order.amount.toLocaleString("en-IN")}</td>
              <td className={`py-3 pr-4 font-medium capitalize ${paymentStyles[order.payment]}`}>
                {order.payment}
              </td>
              <td className="py-3 pr-4 text-on-surface-variant">{order.date}</td>
              <td className="py-3 pr-4 text-right">
                <button
                  type="button"
                  onClick={() => onView?.(order.id)}
                  className="text-primary font-semibold hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
