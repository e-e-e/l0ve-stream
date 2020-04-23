import { all, fork } from "redux-saga/effects";
import { playlistSagas } from "./playlists";
import { userSagas } from "./users";
import { uiSagas } from "./ui";

export const rootSaga = function* root() {
  yield all([fork(playlistSagas), fork(userSagas), fork(uiSagas)]);
};
