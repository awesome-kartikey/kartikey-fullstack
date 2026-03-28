// app/layout.tsx
import "./globals.css";
import { Inter, Geist } from "next/font/google";
import Navigation from "../components/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { ColorPicker } from "@/components/ColorPicker";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { AuthProvider } from "@/contexts/AuthContext";
import Link from "next/link";
import { cookies } from "next/headers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Task Notes",
    default: "Task Notes",
  },
  description: "Personal task management application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const initialUser = userCookie
    ? JSON.parse(decodeURIComponent(userCookie))
    : null;
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <AuthProvider initialUser={initialUser}>
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/70 backdrop-blur-lg transition-all duration-300">
            <nav className="max-w-7xl mx-auto flex h-16 justify-between items-center px-4 sm:px-8">
              <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                Task Notes
              </Link>
              <div className="flex items-center gap-4 md:gap-8">
                <Navigation />
                <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-border/40">
                  <ColorPicker />
                  <ThemeToggle />
                </div>
                <div className="lg:hidden">
                   <ThemeToggle />
                </div>
              </div>
            </nav>
          </header>

          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>

          <footer className="bg-muted p-4 text-center text-muted-foreground mt-auto border-t">
            <p>&copy; {new Date().getFullYear()} Task Notes</p>
          </footer>

          <Toaster position="bottom-right" richColors />
          <KeyboardShortcuts />
        </AuthProvider>
      </body>
    </html>
  );
}
