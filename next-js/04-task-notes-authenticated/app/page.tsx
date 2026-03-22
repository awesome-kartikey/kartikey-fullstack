// app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Task Notes — your personal task management application.",
  openGraph: {
    siteName: "Task Notes",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6 md:p-12 text-center space-y-10 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Task Notes
          </span>{" "}
          App
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Welcome to your personal productivity hub. Manage tasks, take notes, and get things done efficiently.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
        <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 gap-2">
          <Link href="/tasks">
            Get Started <ArrowRight className="size-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t w-full text-left text-muted-foreground">
        
        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border shadow-sm">
          <CheckCircle2 className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Organize Easily</h3>
            <p className="text-sm">Keep all your tasks and notes neatly structured in one place.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border shadow-sm">
          <CheckCircle2 className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Stay Focused</h3>
            <p className="text-sm">Prioritize your work and boost your productivity efficiently.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-card border shadow-sm">
          <CheckCircle2 className="size-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Dark Mode Ready</h3>
            <p className="text-sm">Seamlessly switch between beautiful light and dark themes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
