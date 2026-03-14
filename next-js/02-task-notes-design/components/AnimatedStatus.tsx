"use client";

import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

export function AnimatedStatus({ completed }: { completed: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {completed ? (
        <motion.div
          key="completed"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            ✓ Completed
          </Badge>
        </motion.div>
      ) : (
        <motion.div
          key="pending"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-400"
          >
            Pending
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
