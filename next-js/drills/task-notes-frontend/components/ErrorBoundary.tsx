// components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            console.error('Global error:', error);
        }
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Something went wrong!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We&apos;re sorry, but something unexpected happened. Our team has been notified.
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={reset}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 inline-block"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}