import { MediaPlayerActions } from "../actions/media_player";

enum PlayerState {
  UNINITIALIZED,
  LOADING,
  PLAYING,
  PAUSED,
  STOPPED,
  ERRORED,
}

type TrackInfo = {
  id: string;
};

type MediaPlayerState = {
  state: PlayerState;
  playlist: string | null;
  queue: TrackInfo[];
};

const initialState = {
  state: PlayerState.UNINITIALIZED,
  playlist: null,
  queue: [],
};

export function mediaPlayerReducer(
  state: MediaPlayerState = initialState,
  action: MediaPlayerActions
): MediaPlayerState {
  return state;
}
