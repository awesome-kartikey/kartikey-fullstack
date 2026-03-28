import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about the Task Notes application.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6 md:p-12 max-w-3xl mx-auto">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Task Notes</h1>
        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        <p className="text-xl text-muted-foreground leading-relaxed">
          Task Notes is a modern task management application built with
          Next.js and connected to a REST API. It is designed to help you organize your daily life efficiently with a beautiful, fast interface.
        </p>
      </div>
    </div>
  );
}