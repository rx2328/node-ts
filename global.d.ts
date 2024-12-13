declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      PG_USERNAME: string;
      PG_PASSWORD: string;
      PG_DATABASE: string;
      REDIS_PORT: string;
      REDIS_HOST: string;
      NODE_ENV: string;
      JWT_KEY: string;
    }
  }
}

export {};
