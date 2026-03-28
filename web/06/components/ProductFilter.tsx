"use client"

import { useState } from 'react'
import Link from 'next/link'

type Product = {
    id: number
    name: string
    category: string
}

export default function ProductFilter({ products }: { products: Product[] }) {
    console.log('ProductFilter — where does this log appear?')

    const [query, setQuery] = useState('')

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div>
            <input
                type="text"
                placeholder="Filter products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-72 mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {filtered.length === 0 ? (
                <p className="text-gray-500">No results for "{query}"</p>
            ) : (
                <ul className="space-y-2">
                    {filtered.map(p => (
                        <li key={p.id} className="flex items-center gap-2">
                            <Link
                                href={`/products/${p.id}`}
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                {p.name}
                            </Link>
                            <span className="text-gray-400 text-sm">— {p.category}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}