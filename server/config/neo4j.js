import neo4j from "neo4j-driver"

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(
  process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD
));
// every session should be closed
export const getReadSession = () => driver.session({ defaultAccessMode: neo4j.session.READ });
export const getWriteSession = () => driver.session({ defaultAccessMode: neo4j.session.WRITE });
