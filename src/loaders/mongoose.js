import mongoose from "mongoose";

import { dbUri } from "../config/index.js";
import logger from "../config/logger.js";

export default async () => {
  await mongoose
    .connect(dbUri)
    .then(() => {
      logger.debug("Mongodb Connection");
    })
    .catch((err) => {
      logger.error(err);
    });
};
