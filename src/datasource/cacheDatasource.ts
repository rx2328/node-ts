import Redis, { Redis as RedisClient } from "ioredis";
import { RedisOptions } from "ioredis/built/cluster/util"; // Importing RedisOptions

class RedisDataSource {
  private static redisClient: RedisClient | null = null;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  // Static method to initialize the Redis connection
  public static initialize(options: RedisOptions): RedisClient {
    if (!RedisDataSource.redisClient) {
      RedisDataSource.redisClient = new Redis(options);
      RedisDataSource.redisClient.on("error", (err) => {
        console.error("Redis connection error:", err);
      });
      console.log("Redis connection initialized.");
    } else {
      console.log("Redis connection already initialized.");
    }

    return RedisDataSource.redisClient;
  }

  // Method to get the Redis client
  public static getClient(): RedisClient {
    if (!RedisDataSource.redisClient) {
      throw new Error(
        "Redis client is not initialized. Please call initialize() first."
      );
    }
    return RedisDataSource.redisClient;
  }
}

export default RedisDataSource;
