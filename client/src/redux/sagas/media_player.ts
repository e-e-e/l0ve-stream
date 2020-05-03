import {
  all,
  fork,
  takeEvery,
  call,
  put,
  take,
  takeLatest,
  select,
  getContext,
  delay,
  race,
} from "redux-saga/effects";
import { eventChannel, END, buffers } from "redux-saga";
import { selectTracksWithFiles } from "../selectors/playlists";
import {
  ActionLoadPlaylist,
  ActionPause,
  ActionPlay,
  ActionStop,
  MediaPlayerActionTypes, setProgress, setQueue,
} from "../actions/media_player";
import { MediaPlayer } from "../../media_player";

function* progressWorker() {
  while (true) {
    const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
    const progress = mediaPlayer.progress();
    yield put(setProgress({ value: progress }));
    yield delay(100);
  }
}


function* watchProgress() {
  while (true) {
    yield take(MediaPlayerActionTypes.PLAY);
    yield race([
      call(progressWorker),
      take(MediaPlayerActionTypes.STOP)
    ]);
  }
}

function* loadPlaylist(data: ActionLoadPlaylist) {
  // set state to loading
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  const tracks = selectTracksWithFiles(data.payload.playlist)(yield select());
  // const trackIds = tracks.map((t) => t.id).filter((a) => a != null) as string[];
  const trackIds = [
    "/samples/1.mp3",
    "/samples/2.mp3",
    "/samples/3.mp3",
    "/samples/4.mp3",
  ]
  mediaPlayer.init(trackIds);
  yield put(setQueue({ tracks: trackIds }));
}

function* play(data: ActionPlay) {
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  // if not inited - init.
  mediaPlayer.play(data.payload.track);
}

function* next() {
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  // if not inited - init.
  mediaPlayer.next();
}
function* prev() {
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  // if not inited - init.
  mediaPlayer.prev();
}
function* pause() {
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  mediaPlayer.pause();
}

function* stop() {
  const mediaPlayer: MediaPlayer = yield getContext("mediaPlayer");
  mediaPlayer.stop();
}

function* watchLoadPlaylist() {
  yield takeLatest(MediaPlayerActionTypes.LOAD_PLAYLIST, loadPlaylist);
}

function* watchPlay() {
  yield takeLatest(MediaPlayerActionTypes.PLAY, play);
}

function* watchNext() {
  yield takeLatest(MediaPlayerActionTypes.NEXT, next);
}

function* watchPrev() {
  yield takeLatest(MediaPlayerActionTypes.PREV, prev);
}

function* watchStop() {
  yield takeLatest(MediaPlayerActionTypes.STOP, stop);
}

function* watchPause() {
  yield takeLatest(MediaPlayerActionTypes.PAUSE, pause);
}

export function* mediaPlayerSagas() {
  yield all([
    fork(watchProgress),
    fork(watchLoadPlaylist),
    fork(watchPlay),
    fork(watchNext),
    fork(watchPrev),
    fork(watchStop),
    fork(watchPause),
  ]);
}
