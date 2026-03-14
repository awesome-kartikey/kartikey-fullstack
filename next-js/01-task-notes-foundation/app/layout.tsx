// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "./components/navigation";

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
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-slate-800 text-white p-4">
          <nav className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Task Notes</h1>
            <Navigation />
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-slate-100 p-4 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} Task Notes</p>
        </footer>
      </body>
    </html>
  );
}
