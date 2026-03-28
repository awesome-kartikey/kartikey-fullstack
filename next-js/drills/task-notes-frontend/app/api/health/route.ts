// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check API connectivity
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/healthz`);

        if (!response.ok) {
            throw new Error('API not responding');
        }

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            api: 'connected',
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}