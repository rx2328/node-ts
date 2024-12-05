import Redis, { Redis as RedisClient } from "ioredis";
import { RedisOptions } from "ioredis/built/cluster/util";
import RedisDataSource from "./cacheDatasource";

class RedisSubScribers {
  private static redisPubSubClient: RedisClient | null = null;

  //   private constructor() {
  //     // Private constructor to prevent instantiation
  //   }
  constructor(options: RedisOptions) {
    this.initialize(options);
  }

  public initialize(options: RedisOptions): RedisClient {
    if (!RedisSubScribers.redisPubSubClient) {
      RedisSubScribers.redisPubSubClient = new Redis(options);
      RedisSubScribers.redisPubSubClient.on("error", (err) => {
        console.error("Redis pubsub connection error:", err);
      });
      this.subscribe();
      console.log("Redis pubsub connection initialized.");
    } else {
      console.log("Redis pubsub connection already initialized.");
    }

    return RedisSubScribers.redisPubSubClient;
  }

  private subscribe() {
    RedisSubScribers.redisPubSubClient?.subscribe("posts", (err, count) => {
      if (err) {
        console.error("Failed to subscribe:", err);
      } else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channel(s).`
        );
      }
    });

    const redisCache = RedisDataSource.getClient();

    RedisSubScribers.redisPubSubClient?.on("message", (channel, message) => {
      if (channel === "posts") {
        console.log("Received message on 'posts':", message);

        redisCache.del(`posts-${message}`);
      }
    });
  }
}

export default RedisSubScribers;
