declare module "bun" {
    interface Env {
        ENABLE_CORS: string | undefined;
        BETTER_AUTH_SECRET: string;
        DATABASE_URL: string;
        MINIO_ENDPOINT: string;
        MINIO_ACCESS_KEY: string;
        MINIO_SECRET_KEY: string;
        MINIO_BUCKET: string;
    }
}
