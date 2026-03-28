// lib/config.ts
import { env } from "./env";

export const config = {
    apiUrl: env.NEXT_PUBLIC_API_URL,
    jwtSecret: env.JWT_SECRET,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
} as const;