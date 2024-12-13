import RedisDataSource from "./datasource/cacheDatasource";
import RedisSubScribers from "./datasource/cacheSubscribe";
import AppSource from "./datasource/datasource";
import RequestDetails from "./middleware/requestDetails.middleware";
import authRouter from "./routes/auth.routes";
import postsRouter from "./routes/posts.routes";
import dotenv from "dotenv";
import express, { Express } from "express";
import fs from "fs";
import https from "https";
import { join } from "path";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

const sslOptions = {
  key: fs.readFileSync(join(__dirname, "..", "cert/private.key")), // Path to your private key
  cert: fs.readFileSync(join(__dirname, "..", "cert/certificate.crt")), // Path to your certificate
};

AppSource.initialize()
  .then(() => {
    try {
      const options = {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      };
      RedisDataSource.initialize(options);

      //self initialize with subscribers
      new RedisSubScribers(options);
    } catch (error) {
      console.log("🚀 ~ .then ~ error:", error);
    }

    app.use(express.json());
    app.use("/api/auth", RequestDetails, authRouter);
    app.use("/api/post", RequestDetails, postsRouter);

    https
      .createServer(sslOptions, app)
      .listen(port, () => console.log("App is listening on port -", port));
  })
  .catch((error) => {
    console.log("Not able to connect with database ", error);
  });
