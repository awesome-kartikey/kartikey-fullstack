"scripts": {
"start": "node index.js",
"run": "tsx",
"dev": "tsx watch index.ts",
"build": "tsc -p tsconfig.base.json",
"lint": "eslint .",
"format": "prettier . --write",
"test": "vitest",
"binge": "node drills/01-foundations/03-scripts/binge.js",
"echo1": "echo one",
"echo2": "echo two",
"chain": "pnpm run echo1 && pnpm run echo2"
},
