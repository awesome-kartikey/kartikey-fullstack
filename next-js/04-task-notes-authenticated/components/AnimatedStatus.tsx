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
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors pointer-events-none">
            Completed
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
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors pointer-events-none"
          >
            In Progress
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
