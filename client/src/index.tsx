import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { installWebSocketClient } from './websocket_client';
import { ApolloProvider } from '@apollo/react-hooks';
import { installRedux } from './redux/install';
import { installGraphQL } from './services/graphql/install';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { installFileUpload } from './services/file_upload/install';
import { createMediaPlayer } from './media_player';

const webSocketClient = installWebSocketClient({
  url: window.location.origin.replace(/^http/, 'ws').replace(/:3000/, ':8080'),
});
const history = createBrowserHistory();
const { client, queries, mutations } = installGraphQL();
const fileUpload = installFileUpload();
const player = createMediaPlayer(fileUpload);

const { ReduxProvider } = installRedux({
  services: { queries, mutations, fileUpload },
  webSocketClient,
  history,
  mediaPlayer: player,
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
  document.getElementById('root'),
);
