"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "./actions";
import type { FormState } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const initialState: FormState = undefined;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] p-6 relative">
      {/* Decorative subtle background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <Card className="max-w-md w-full shadow-2xl bg-card/60 backdrop-blur-xl border-border/40 relative z-10 p-2 sm:p-4 rounded-2xl">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center tracking-tight">
            Sign in to Task Notes
          </CardTitle>
          <CardDescription className="text-center text-base">
            Or{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium hover:underline underline-offset-4 pointer-events-auto">
              create a new account
            </Link>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-foreground/80 font-medium">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
              />
              {state?.errors?.email?.[0] && (
                <p className="text-sm text-destructive font-medium">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
              />
              {state?.errors?.password?.[0] && (
                <p className="text-sm text-destructive font-medium">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {state?.message && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 mt-2">
                <p className="text-sm text-destructive font-medium">{state.message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 text-base font-medium shadow-md transition-all hover:shadow-lg mt-6"
            >
              {pending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
