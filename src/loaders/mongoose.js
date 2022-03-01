import mongoose from "mongoose";
import { env } from "../config/index.js"
import logger from "../config/logger.js";

export default async () => {
  await mongoose
    .connect( env.MONGO_URI)
    .then(() => {
      logger.debug("Mongodb Connection");
    })
    .catch((err) => {
      logger.error(err);
    });
};
