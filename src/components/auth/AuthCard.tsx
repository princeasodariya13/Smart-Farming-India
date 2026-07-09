"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

/** Elevated card shell shared by all auth screens (login, register, etc.). */
export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ boxShadow: "0 30px 60px -15px rgba(13,99,27,0.15)" }}
      className={cn(
        "flex h-full min-h-[700px] w-full max-w-[1100px] overflow-hidden rounded-[32px] bg-surface-container-lowest shadow-2xl shadow-primary/10",
        className
      )}
    >
      {children}
    </motion.main>
  );
}
