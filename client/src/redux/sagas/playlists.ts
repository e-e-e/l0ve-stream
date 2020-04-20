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
  ActionCreatePlaylist,
  ActionDeletePlaylist,
  ActionDeletePlaylistTrack,
  ActionPlaylistFetch,
  ActionUpdatePlaylistTrackOrder,
  fetchPlaylistError,
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
  fetchPlaylistSuccess,
  PlaylistActionTypes,
} from "../actions/playlists_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import { GraphMutationsService } from "../../services/graphql/mutations";
import { RootState } from "../reducers/reducers";
import { playlistUrl } from "../../routes/routes";
import { History } from "history";

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

function* deletePlaylist(action: ActionDeletePlaylist) {
  const mutations: GraphMutationsService = yield getContext("mutations");
  try {
    const data: PromisedReturnType<
      GraphMutationsService["deletePlaylist"]
    > = yield call(() => mutations.deletePlaylist(action.payload.playlistId));
    console.log("deleted", data);
  } catch (e) {
    console.log("throw throw", e);
  }
}

function* createPlaylist(action: ActionCreatePlaylist) {
  const mutations: GraphMutationsService = yield getContext("mutations");
  const history: History = yield getContext("history");
  try {
    const data: PromisedReturnType<
      GraphMutationsService["createPlaylist"]
    > = yield call(() => mutations.createPlaylist(action.payload));
    if (data && data.playlist) {
      history.push(playlistUrl(data.playlist.id));
    }
  } catch (e) {
    console.log("throw throw", e);
  }
}

function* watchPlaylistsFetch() {
  yield takeLatest(PlaylistActionTypes.FETCH_PLAYLISTS, fetchPlaylists);
}

function* watchPlaylistFetch() {
  yield takeLatest(PlaylistActionTypes.FETCH_PLAYLIST, fetchPlaylist);
}

function* watchDeletePlaylistTrack() {
  yield takeLatest(PlaylistActionTypes.DELETE_PLAYLIST_TRACK, updatePlaylist);
}

function* watchUpdatePlaylist() {
  yield takeLatest(
    PlaylistActionTypes.UPDATE_PLAYLIST_TRACK_ORDER,
    updatePlaylist
  );
}

function* watchDeletePlaylist() {
  yield takeLatest(PlaylistActionTypes.DELETE_PLAYLIST, deletePlaylist);
}

function* watchCreatePlaylist() {
  yield takeLatest(PlaylistActionTypes.CREATE_PLAYLIST, createPlaylist);
}

export const playlistSagas = function* playlistSagas() {
  yield all([
    fork(watchPlaylistsFetch),
    fork(watchPlaylistFetch),
    fork(watchUpdatePlaylist),
    fork(watchDeletePlaylistTrack),
    fork(watchDeletePlaylist),
    fork(watchCreatePlaylist),
  ]);
};
