FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm pm2
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.cjs"]