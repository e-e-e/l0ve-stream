import { all, fork } from 'redux-saga/effects';
import { playlistSagas } from './playlists';
import { userSagas } from './users';
import { uiSagas } from './ui';
import { mediaPlayerSagas } from './media_player';

export const rootSaga = function* root() {
  yield all([
    fork(playlistSagas),
    fork(userSagas),
    fork(uiSagas),
    fork(mediaPlayerSagas),
  ]);
};
