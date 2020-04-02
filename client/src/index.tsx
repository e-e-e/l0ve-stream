import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import * as serviceWorker from './serviceWorker';
import { installWebsocketClient } from "./websocket_client";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { install as installDnD } from "./drag_and_drop/install";
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

installWebsocketClient({ url: "ws://localhost:8000" });
installDnD({ url: "/convert/itunes", apolloClient: client });

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
