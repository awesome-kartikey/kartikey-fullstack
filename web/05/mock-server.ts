Bun.serve({
    port: 3001,
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/api/search') {
            const q = url.searchParams.get('q') ?? '';

            // Random delay 100–800ms — needed for race condition lab
            const delay = Math.random() * 700 + 100;
            await new Promise(resolve => setTimeout(resolve, delay));

            const results = q
                ? [
                    { id: 1, name: `First result for "${q}"` },
                    { id: 2, name: `Second result for "${q}"` },
                    { id: 3, name: `Third result for "${q}"` },
                ]
                : [];

            return Response.json(results, {
                headers: { 'Access-Control-Allow-Origin': '*' },
            });
        }

        return new Response('Not found', { status: 404 });
    },
});

console.log('Mock API running at http://localhost:3001');