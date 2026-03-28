FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/openapi.json ./openapi.json
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
