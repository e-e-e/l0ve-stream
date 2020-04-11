import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { installWebsocketClient } from "./websocket_client";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

installWebsocketClient({ url: "ws://localhost:8000" });

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
