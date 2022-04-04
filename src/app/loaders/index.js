import mongooseLoader from "./mongoose.js";
import expressLoader from "./express.js";
import { connectToNeo } from "./neo4j.js";

export default async (app) => {
  await mongooseLoader();
  await connectToNeo();
  expressLoader(app);
};
