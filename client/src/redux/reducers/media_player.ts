import {
  MediaPlayerActions,
  MediaPlayerActionTypes,
} from '../actions/media_player';

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
  progress: number;
  duration: number;
  elapsed: number;
};

const initialState = {
  state: PlayerState.UNINITIALIZED,
  playlist: null,
  queue: [],
  currentTrack: null,
  progress: 0,
  duration: 0,
  elapsed: 0,
};

export function mediaPlayerReducer(
  state: MediaPlayerState = initialState,
  action: MediaPlayerActions,
): MediaPlayerState {
  switch (action.type) {
    case MediaPlayerActionTypes.SET_CURRENT_TRACK:
      return { ...state, currentTrack: action.payload.track };
    case MediaPlayerActionTypes.SET_QUEUE:
      return {
        ...state,
        queue: action.payload.tracks.map((id) => ({ id })),
        playlist: action.payload.playlist,
      };
    case MediaPlayerActionTypes.SET_PROGRESS:
      return {
        ...state,
        progress: action.payload.value,
        elapsed: action.payload.elapsed,
        duration: action.payload.duration,
      };
    case MediaPlayerActionTypes.STOP:
      return { ...state, progress: 0, elapsed: 0 };
  }
  return state;
}
