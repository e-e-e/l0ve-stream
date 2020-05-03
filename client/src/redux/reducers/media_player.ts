import {
  MediaPlayerActions,
  MediaPlayerActionTypes,
} from "../actions/media_player";

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
  currentTrack: string | null;
};

const initialState = {
  state: PlayerState.UNINITIALIZED,
  playlist: null,
  queue: [],
  currentTrack: null,
};

export function mediaPlayerReducer(
  state: MediaPlayerState = initialState,
  action: MediaPlayerActions
): MediaPlayerState {
  switch (action.type) {
    case MediaPlayerActionTypes.SET_CURRENT_TRACK:
      return { ...state, currentTrack: action.payload.track };
    case MediaPlayerActionTypes.SET_QUEUE:
      return { ...state, queue: action.payload.tracks.map((id) => ({ id })) };
  }
  return state;
}
