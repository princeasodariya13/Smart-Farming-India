"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-sage/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center justify-center p-8 bg-surface-glass rounded-3xl shadow-xl border border-white/20 relative overflow-hidden"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"
        />
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center shadow-inner mb-4"
        >
          <Leaf size={32} strokeWidth={2.5} className="text-primary drop-shadow-sm" />
        </motion.div>

        <h3 className="relative z-10 text-title-md font-bold text-on-surface tracking-tight">
          Smart Farming<span className="text-primary">.</span>
        </h3>
        
        <div className="relative z-10 mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
