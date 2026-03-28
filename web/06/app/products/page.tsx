import Link from 'next/link'
import ProductFilter from '@/components/ProductFilter'

type Product = {
    id: number
    name: string
    category: string
}

export default async function ProductsPage() {
    console.log('ProductsPage — where does this log appear?')

    const products: Product[] = [
        { id: 1, name: 'Laptop Pro', category: 'electronics' },
        { id: 2, name: 'USB-C Hub', category: 'electronics' },
        { id: 3, name: 'Standing Desk', category: 'furniture' },
        { id: 4, name: 'Desk Chair', category: 'furniture' },
        { id: 5, name: 'Notebook A5', category: 'stationery' },
    ]

    return (
        <main className="p-8">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">
                ⬅️ Home
            </Link>
            <h1 className="text-2xl font-bold my-4">Products</h1>
            <ProductFilter products={products} />
        </main>
    )
}