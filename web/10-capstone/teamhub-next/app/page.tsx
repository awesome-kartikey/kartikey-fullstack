import Link from 'next/link'
import { cookies } from 'next/headers'
import LoginForm from '@/components/LoginForm'
import LogoutButton from '@/components/LogoutButton'
import { getUserFromSessionValue } from '@/lib/auth'
import { articles, projects, team } from '@/lib/data'

export default async function HomePage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get('session')?.value
  const currentUser = getUserFromSessionValue(sessionValue)

  return (
    <main className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">TeamHub</h1>
        <p className="text-gray-600">Local engineering intranet.</p>
      </header>

      <nav className="flex flex-wrap gap-4 text-blue-700">
        <Link href="/projects">Projects</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/team">Team</Link>
      </nav>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="mt-2 text-3xl font-bold">{projects.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Articles</p>
          <p className="mt-2 text-3xl font-bold">{articles.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Team size</p>
          <p className="mt-2 text-3xl font-bold">{team.length}</p>
        </div>
      </section>

      {currentUser ? (
        <section className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-semibold">Signed in</h2>
          <p className="mt-2">
            You are logged in as <span className="font-medium">{currentUser.name}</span>.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/me"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Go to /me
            </Link>
            <LogoutButton />
          </div>
        </section>
      ) : (
        <LoginForm />
      )}
    </main>
  )
}
