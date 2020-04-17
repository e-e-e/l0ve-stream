import {
  call,
  put,
  takeLatest,
  fork,
  all,
  getContext,
  select,
} from "redux-saga/effects";
import {
  ActionDeletePlaylistTrack,
  ActionPlaylistFetch,
  ActionUpdatePlaylistTrackOrder,
  fetchPlaylistError,
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
  fetchPlaylistSuccess,
} from "../actions/playlists_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import {
  DELETE_PLAYLIST_TRACK,
  FETCH_PLAYLIST,
  FETCH_PLAYLISTS,
  UPDATE_PLAYLIST_TRACK_ORDER,
} from "../actions/action_types";
import { GraphMutationsService } from "../../services/graphql/mutations";
import { RootState } from "../reducers/reducers";

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

const selectPlaylist = (id: string) => (state: RootState) =>
  state.entities.playlists.byId[id];

function* updatePlaylist(
  action: ActionUpdatePlaylistTrackOrder | ActionDeletePlaylistTrack
) {
  const playlist = yield select(selectPlaylist(action.payload.playlistId));
  const mutations: GraphMutationsService = yield getContext("mutations");

  try {
    const data: PromisedReturnType<
      GraphMutationsService["updatePlaylist"]
    > = yield call(() => mutations.updatePlaylist(playlist));
    console.log("updated", data);
  } catch (e) {
    console.log("throw throw", e);
  }
}

function* watchPlaylistsFetch() {
  yield takeLatest(FETCH_PLAYLISTS, fetchPlaylists);
}

function* watchPlaylistFetch() {
  yield takeLatest(FETCH_PLAYLIST, fetchPlaylist);
}

function* watchDeletePlaylistTrack() {
  yield takeLatest(DELETE_PLAYLIST_TRACK, updatePlaylist);
}

function* watchUpdatePlaylist() {
  yield takeLatest(UPDATE_PLAYLIST_TRACK_ORDER, updatePlaylist);
}

export const playlistSagas = function* playlistSagas() {
  yield all([
    fork(watchPlaylistsFetch),
    fork(watchPlaylistFetch),
    fork(watchUpdatePlaylist),
    fork(watchDeletePlaylistTrack),
  ]);
};
