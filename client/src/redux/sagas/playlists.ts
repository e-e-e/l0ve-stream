import {
  call,
  put,
  takeLatest,
  fork,
  all,
  getContext,
} from "redux-saga/effects";
import {
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
} from "../actions/playlists_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import { FETCH_PLAYLISTS } from "../actions/action_types";

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
type PromisedReturnType<T extends (...args: any) => Promise<any>> = PromiseType<
  ReturnType<T>
  >;

function* fetchPlaylist() {
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
function* watchPlaylistFetch() {
  yield takeLatest(FETCH_PLAYLISTS, fetchPlaylist);
}

export const playlistSagas = function* playlistSagas() {
  yield all([fork(watchPlaylistFetch)]);
};
