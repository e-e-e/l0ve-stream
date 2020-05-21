import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import { reducer } from './reducers/reducers';
import { rootSaga } from './sagas/sagas';
import { Provider } from 'react-redux';
import React, { PropsWithChildren } from 'react';
import { GraphQueriesService } from '../services/graphql/queries';
import { composeWithDevTools } from 'redux-devtools-extension';
import { GraphMutationsService } from '../services/graphql/mutations';
import { History } from 'history';
import { FileUploadService } from '../services/file_upload/install';
import { MediaPlayer } from '../media_player';
import { setCurrentTrack } from './actions/media_player';
import {WebSocketClient} from "../websocket_client";
import {updateTrackTranscodingStatus} from "./actions/playlists_actions";

export function installRedux({
  services,
  history,
  webSocketClient,
  mediaPlayer,
}: {
  services: {
    queries: GraphQueriesService;
    mutations: GraphMutationsService;
    fileUpload: FileUploadService;
  };
  history: History<unknown>;
  webSocketClient: WebSocketClient;
  mediaPlayer: MediaPlayer;
}) {
  const sagaMiddleware = createSagaMiddleware({
    context: {
      queries: services.queries,
      mutations: services.mutations,
      fileUpload: services.fileUpload,
      history,
      webSocketClient,
      mediaPlayer,
    },
  });

  const middleware = applyMiddleware(sagaMiddleware);
  const store = createStore(reducer, {}, composeWithDevTools(middleware));
  sagaMiddleware.run(rootSaga);

  mediaPlayer.on('playing', (id) => {
    store.dispatch(setCurrentTrack({ track: id }));
  });

  webSocketClient.onTranscodingUpdate((data) => {
    store.dispatch(updateTrackTranscodingStatus(data));
  })
  return {
    ReduxProvider: ({ children }: PropsWithChildren<{}>) => (
      <Provider store={store}>{children}</Provider>
    ),
  };
}
