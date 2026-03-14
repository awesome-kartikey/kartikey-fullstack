// app/components/navigation.tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex space-x-4">
      <Link href="/" className="hover:text-slate-300">Home</Link>
      <Link href="/tasks" className="hover:text-slate-300">Tasks</Link>
      <Link href="/about" className="hover:text-slate-300">About</Link>
    </nav>
  );
}