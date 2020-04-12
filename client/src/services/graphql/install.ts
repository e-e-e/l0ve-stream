import ApolloClient from "apollo-boost";
import { GraphQueriesClient } from "./queries";

export function installGraphQL() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI || "http://localhost:3000/graphql",
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  return {
    client,
    queries: new GraphQueriesClient(client),
  }
}
