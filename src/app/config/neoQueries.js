export function getNeoQuery(name){
	return neoQueries[name]
}
const neoQueries = {
	insertForId: 'MERGE (:User{_id: $id })',
	followUser2: 'MATCH (user1:User{_id: $user1Id}) MATCH (user2:User{_id: $user2Id}) MERGE (user1)-[:FOLLOWS]->(user2)',
	getFollowsForUser1: 'MATCH (user1:User{_id: $user1Id}) MATCH (user1:User)-[:FOLLOWS]->(user2:User) RETURN user1',
	getFollowersForUser1: 'MATCH (user1:User{_id: $user1Id}) MATCH (user2:User)-[:FOLLOWS]->(user1:User) RETURN user1',
	unFollowUser2: 'MATCH (user1:User{_id: $user1Id}) MATCH (user2:User{_id: $user2Id}) MATCH (user1)-[rel:FOLLOWS]->(user2) DELETE rel'
}