"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export function AnimatedButtonWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="flex-1 flex w-full"
    >
      {children}
    </motion.div>
  );
}
