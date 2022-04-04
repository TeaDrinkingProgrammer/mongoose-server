import logger from "../config/logger.js";
import { env } from "../config/index.js"
import neo4j from 'neo4j-driver';
let driver;
export async function connectToNeo() {
	try {
		if (env.NODE_ENV !== 'test') {
			await connect()
			console.info('Connected to Neo4j DB')
		} else {
			await connect()
			console.info('Connected to Neo4j test DB')
		}
	} catch (err) {
		console.warn('Failed to connect to Neo4j database, will try again in 6 seconds')
		console.error('Error: ',err)
		setTimeout(connectToNeo,6000)
	}
}

async function connect() {
	driver = neo4j.driver(
		env.NEO4J_URI,
		neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
		{ disableLosslessIntegers: true }
	)
	await driver.verifyConnectivity()
}

export function getSession() {
		return driver.session({
			database: env.NEO4J_DBNAME,
			defaultAccessMode: neo4j.session.WRITE,
		})
}