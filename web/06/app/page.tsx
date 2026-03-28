import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <nav className="flex gap-4">
        <Link href="/products" className="text-blue-600 underline hover:text-blue-800">
          View Products
        </Link>
        <Link href="/about" className="text-blue-600 underline hover:text-blue-800">
          About
        </Link>
      </nav>
    </main>
  )
}