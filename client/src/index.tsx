import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { installWebsocketClient } from "./websocket_client";
import { ApolloProvider } from "@apollo/react-hooks";
import { installRedux } from "./redux/install";
import { installGraphQL } from "./services/graphql/install";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import { installFileUpload } from "./services/file_upload/install";

const { subscribeToTranscodeUpdates } = installWebsocketClient({
  url: "ws://localhost:8000",
});
const history = createBrowserHistory();
const { client, queries, mutations } = installGraphQL();
const fileUpload = installFileUpload();

const { ReduxProvider } = installRedux({
  services: { queries, mutations, fileUpload },
  subscribeToTranscodeUpdates,
  history,
});

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider>
      <ApolloProvider client={client}>
        <Router history={history}>
          <App />
        </Router>
      </ApolloProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
