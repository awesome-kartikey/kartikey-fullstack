// app/layout.tsx
import "./globals.css";
import { Inter, Geist } from "next/font/google";
import Navigation from "../components/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { ColorPicker } from "@/components/ColorPicker";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Task Notes",
    default: "Task Notes",
  },
  description: "Personal task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <header className="bg-slate-800 text-white p-4">
          <nav className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Task Notes
            </Link>
            <div className="flex items-center gap-6">
              <Navigation />
              <div className="hidden md:block border-l border-slate-600 pl-6">
                <ColorPicker />
              </div>
            </div>
            <ThemeToggle />
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-slate-100 p-4 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} Task Notes</p>
        </footer>

        <Toaster position="bottom-right" richColors />
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
