import {
  call,
  put,
  takeLatest,
  fork,
  all,
  getContext,
} from "redux-saga/effects";
import {
  ActionPlaylistFetch,
  fetchPlaylistError,
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
  fetchPlaylistSuccess,
} from "../actions/playlists_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import { FETCH_PLAYLIST, FETCH_PLAYLISTS } from "../actions/action_types";

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
type PromisedReturnType<T extends (...args: any) => Promise<any>> = PromiseType<
  ReturnType<T>
>;

function* fetchPlaylists() {
  const queries: GraphQueriesService = yield getContext("queries");
  try {
    const data: PromisedReturnType<
      GraphQueriesService["playlists"]
    > = yield call(() => queries.playlists());
    yield put(fetchPlaylistsSuccess(data));
  } catch (e) {
    yield put(fetchPlaylistsError({ errorMessage: e.message }));
  }
}

function* fetchPlaylist(action: ActionPlaylistFetch) {
  const queries: GraphQueriesService = yield getContext("queries");
  try {
    const data: PromisedReturnType<
      GraphQueriesService["playlist"]
    > = yield call(() => queries.playlist(action.payload.id));
    yield put(fetchPlaylistSuccess(data));
  } catch (e) {
    yield put(fetchPlaylistError({ errorMessage: e.message }));
  }
}

function* watchPlaylistsFetch() {
  yield takeLatest(FETCH_PLAYLISTS, fetchPlaylists);
}

function* watchPlaylistFetch() {
  yield takeLatest(FETCH_PLAYLIST, fetchPlaylist);
}

export const playlistSagas = function* playlistSagas() {
  yield all([fork(watchPlaylistsFetch), fork(watchPlaylistFetch)]);
};
