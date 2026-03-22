"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="h-6 w-32 bg-muted animate-pulse rounded" />;
  }

  return (
    <nav className="flex items-center space-x-4">
      <Link href="/" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        Home
      </Link>

      <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
        About
      </Link>

      {user ? (
        <>
          <Link
            href="/tasks"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Tasks
          </Link>

          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            {user.name ?? user.email}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={logout}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}
