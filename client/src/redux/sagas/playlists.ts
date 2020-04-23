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
  ActionCreatePlaylistTrack,
  ActionDeletePlaylist,
  ActionDeletePlaylistTrack,
  ActionInsertPlaylistTrack,
  ActionPlaylistFetch,
  ActionUpdatePlaylistTrackOrder,
  fetchPlaylistError,
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
  fetchPlaylistSuccess,
  insertPlaylistTrack,
  PlaylistActionTypes,
  syncPlaylist,
  syncPlaylistError,
  syncPlaylistSuccess,
} from "../actions/playlists_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import { GraphMutationsService } from "../../services/graphql/mutations";
import { RootState } from "../reducers/reducers";
import { playlistUrl } from "../../routes/routes";
import { History } from "history";
import { FileUploadService } from "../../services/file_upload/install";
import { uploadRequest } from "../actions/ui_actions";

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
  action:
    | ActionUpdatePlaylistTrackOrder
    | ActionDeletePlaylistTrack
    | ActionInsertPlaylistTrack
) {
  const playlist = yield select(selectPlaylist(action.payload.playlistId));
  const mutations: GraphMutationsService = yield getContext("mutations");

  try {
    yield put(syncPlaylist());
    const data: PromisedReturnType<
      GraphMutationsService["updatePlaylist"]
    > = yield call(() => mutations.updatePlaylist(playlist));
    console.log("updated", data);
    if (data === null || data.playlist === null) {
      return;
    }
    yield put(syncPlaylistSuccess({ playlist: data.playlist }));
  } catch (e) {
    console.log("throw throw", e);
    yield put(syncPlaylistError({ errorMessage: e.message }));
  }
}

function* createPlaylistTrack(action: ActionCreatePlaylistTrack) {
  const { playlistId, track } = action.payload;
  const playlist = yield select(selectPlaylist(playlistId));
  const mutations: GraphMutationsService = yield getContext("mutations");
  const fileUpload: FileUploadService = yield getContext("fileUpload");
  const subscribeToTranscodeUpdates = yield getContext(
    "subscribeToTranscodeUpdates"
  );
  try {
    // insert track into database
    const data: PromisedReturnType<
      GraphMutationsService["insertTrack"]
    > = yield call(() =>
      mutations.insertTrack(playlistId, track, playlist.tracks.length)
    );
    const id = data?.track?.id;
    if (!id) {
      throw new Error("did not return track id");
    }
    // insert track into reducer
    yield put(insertPlaylistTrack({ playlistId, track: { ...track, id } }));
    if (!track.file) {
      // bail out early - nothing to upload
      return;
    }
    console.log("f", track.file.type);
    // fetch presigned url
    const presignedUrl: PromisedReturnType<
      FileUploadService["getPresignedTrackUploadUrl"]
    > = yield call(() =>
      fileUpload.getPresignedTrackUploadUrl({
        trackId: id,
        type: track.file?.type || "mp3",
      })
    );
    subscribeToTranscodeUpdates(presignedUrl.fileId);
    console.log(presignedUrl);
    // start uploading
    yield put(
      uploadRequest({
        endpoint: presignedUrl.url,
        trackId: id,
        playlistId,
        file: track.file,
        filename: `${id}/${playlistId}`,
      })
    );
  } catch (e) {
    console.log("throw throw", e);
    // yield put(syncPlaylistError({ errorMessage: e.message }));
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

function* watchCreatePlaylistTrack() {
  yield takeLatest(
    PlaylistActionTypes.CREATE_PLAYLIST_TRACK,
    createPlaylistTrack
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
    fork(watchCreatePlaylistTrack),
    fork(watchDeletePlaylistTrack),
    fork(watchDeletePlaylist),
    fork(watchCreatePlaylist),
  ]);
};
