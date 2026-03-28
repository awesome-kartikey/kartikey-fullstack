import Link from 'next/link'

type Props = {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params

    const products: Record<string, { name: string; category: string }> = {
        '1': { name: 'Laptop Pro', category: 'electronics' },
        '2': { name: 'USB-C Hub', category: 'electronics' },
        '3': { name: 'Standing Desk', category: 'furniture' },
        '4': { name: 'Desk Chair', category: 'furniture' },
        '5': { name: 'Notebook A5', category: 'stationery' },
    }

    const product = products[id]

    if (!product) {
        return (
            <main className="p-8">
                <Link href="/products" className="text-blue-600 underline hover:text-blue-800">
                    ⬅️ Products
                </Link>
                <p className="mt-4 text-gray-600">
                    No product found for id: <strong>{id}</strong>
                </p>
            </main>
        )
    }

    return (
        <main className="p-8">
            <Link href="/products" className="text-blue-600 underline hover:text-blue-800">
                ⬅️ Products
            </Link>
            <h1 className="text-2xl font-bold my-4">{product.name}</h1>
            <p className="text-gray-700">
                ID captured from URL: <strong className="text-black">{id}</strong>
            </p>
            <p className="text-gray-700 mt-1">
                Category: <span className="capitalize">{product.category}</span>
            </p>
        </main>
    )
}