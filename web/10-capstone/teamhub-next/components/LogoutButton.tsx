'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
    const router = useRouter()
    const [pending, setPending] = useState(false)

    async function handleLogout() {
        setPending(true)

        try {
            await fetch('/logout', {
                method: 'POST',
            })

            router.push('/')
            router.refresh()
        } finally {
            setPending(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            className="rounded-lg bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
        >
            {pending ? 'Logging out...' : 'Logout'}
        </button>
    )
}
