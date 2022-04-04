import {loadMongoose} from "./mongoose.js";
import expressLoader from "./express.js";
import { connectToNeo } from "./neo4j.js";
import { env } from "../config/index.js";

export default async (app) => {
  if(env.NODE_ENV == 'test'){
      env.MONGO_URI = env.MONGO_TEST_URI
      env.NEO4J_DBNAME = env.NEO$J_TEST_DBNAME
    }
    expressLoader(app);
    await loadMongoose();
    await connectToNeo();
};