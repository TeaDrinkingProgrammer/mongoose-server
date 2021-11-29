import express from "express";
import { port } from "./config/index.js";
import loader from "./loaders/index.js";
import logger from "./config/logger.js";

const app = express();

loader(app);

app.listen(port, (err) => {
  if (err) {
    logger.error(err);
    return process.exit(1);
  }
  logger.debug(`Server is running on ${port}`);
});

export default app;
