import { config } from "dotenv";
config();

//NOTE: If you are running the project in an instance, you should store these secret keys in its configuration settings.
// This type of storing secret information is only experimental and for the purpose of local running.

export const env = process.env;

env.PORT = env.PORT || 3000;
env.NEO4J_URL = env.NEO4J_URL || 'bolt://localhost:7687'
env.NEO4J_USER = env.NEO4J_USER || 'neo4j';
env.NEO4J_PASSWORD = env.NEO4J_PASSWORD || 'secret';
env.NEO4J_DBNAME = env.NEO4J_DBNAME || "neo4j";

export const prefix = "/api";
