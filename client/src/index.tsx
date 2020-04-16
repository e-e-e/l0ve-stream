import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { installWebsocketClient } from "./websocket_client";
import { ApolloProvider } from "@apollo/react-hooks";
import { installRedux } from "./redux/install";
import { installGraphQL } from "./services/graphql/install";

installWebsocketClient({ url: "ws://localhost:8000" });
const { client, queries, mutations } = installGraphQL();
const { ReduxProvider } = installRedux({ services: { queries, mutations } });

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
