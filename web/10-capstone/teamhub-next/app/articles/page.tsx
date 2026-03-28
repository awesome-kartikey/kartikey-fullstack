import Link from 'next/link'
import { articles, getMemberName } from '@/lib/data'

export default function ArticlesPage() {
    return (
        <main className="space-y-6">
            <header className="space-y-3">
                <Link href="/" className="text-blue-700">
                    ⬅️ Home
                </Link>
                <h1 className="text-3xl font-bold">Articles</h1>
            </header>

            <section className="grid gap-4">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-2xl font-semibold">
                            <Link href={`/articles/${article.id}`}>{article.title}</Link>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Author: {getMemberName(article.author)}
                        </p>
                        <p className="text-sm text-gray-600">Date: {article.date}</p>
                    </article>
                ))}
            </section>
        </main>
    )
}
