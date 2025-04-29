import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

const publicRoutes = [
    '/api/health',
    '/api/auth/**',
]

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [Bun.env.ENABLE_CORS === "true" ? "http://localhost:5173" : ""]
});

// Helper function to check if a path matches a pattern with wildcards
const matchesPattern = (path: string, pattern: string): boolean => {
    if (pattern.endsWith('/**')) {
        const prefix = pattern.slice(0, -2); // Remove /** from the end
        return path.startsWith(prefix);
    }
    return path === pattern;
};

// Authentication middleware
export const requireAuth = async (c: any, next: any) => {
    // Skip auth check for public routes
    if (publicRoutes.some(pattern => matchesPattern(c.req.path, pattern))) {
        return next()
    }

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
        return c.json({ message: 'Unauthorized' }, 401)
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
};

export const authHandler = async (c: any) => {
    return auth.handler(c.req.raw);
};