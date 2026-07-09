"use client";

import { motion } from "framer-motion";
import { Sprout, TrendingUp } from "lucide-react";

/**
 * Left-hand agriculture-themed brand panel, desktop only.
 * Purely presentational — no data fetching or business logic.
 */
export default function AuthBrandPanel() {
  return (
    <section
      aria-hidden="true"
      className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 lg:flex"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/login-bg.png" alt="Smart Farming" className="h-full w-full object-cover mix-blend-overlay opacity-30" />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary/90 to-transparent" />

      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-container/30 blur-3xl z-0" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl z-0" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md space-y-6 text-white"
      >
        <div className="mb-8 flex items-center gap-2">
          <Sprout size={36} strokeWidth={2} />
          <span className="text-2xl font-semibold tracking-tight">
            Smart Farming India
          </span>
        </div>

        <h2 className="text-4xl font-bold leading-tight tracking-tight">
          Empowering the roots of our nation.
        </h2>
        <p className="text-lg text-white/80">
          Join India&apos;s most advanced agricultural ecosystem. Access
          marketplace insights, disease detection, and expert community
          support at your fingertips.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-12 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
            <TrendingUp size={22} className="text-on-secondary-container" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/80">
              Current Market Trend
            </p>
            <p className="text-xl font-bold">+12.4% Wheat Yield</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
