"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedTaskCardProps {
  children: ReactNode;
  index: number;
}

export function AnimatedTaskCard({ children, index }: AnimatedTaskCardProps) {
  return (
    <motion.div
      // 1. Initial fade and slide up
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      
      // 2. Stagger based on index
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      
      layout
    >
      {children}
    </motion.div>
  );
}