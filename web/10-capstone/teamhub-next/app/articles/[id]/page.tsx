import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles, getMemberName } from '@/lib/data'

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const article = articles.find((item) => item.id === id)

    if (!article) {
        notFound()
    }

    return (
        <main className="space-y-6">
            <Link href="/articles" className="text-blue-700">
                ⬅️ Back to articles
            </Link>

            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-bold">{article.title}</h1>
                <p className="mt-3 text-sm text-gray-600">
                    Author: {getMemberName(article.author)}
                </p>
                <p className="text-sm text-gray-600">Date: {article.date}</p>
                <p className="mt-6 leading-7 text-gray-800">{article.body}</p>
            </article>
        </main>
    )
}
