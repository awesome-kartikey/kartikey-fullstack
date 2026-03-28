'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!username || !password) {
            setError('Please enter username and password')
            return
        }
        setPending(true)
        setError('')

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error ?? 'Login failed')
                return
            }

            router.push('/me')
            router.refresh()
        } catch {
            setError('Login request failed')
        } finally {
            setPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Login</h2>

            <div>
                <label htmlFor="username" className="mb-2 block font-medium">
                    Username
                </label>
                <input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-2 block font-medium">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
            </div>

            <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
                {pending ? 'Logging in...' : 'Login'}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
    )
}
