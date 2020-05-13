import { createAction } from 'redux-actions';
import { ActionWithPayload } from './types';

export enum MediaPlayerActionTypes {
  LOAD_PLAYLIST = 'MP_LOAD_PLAYLIST',
  PLAY = 'MP_PLAY',
  NEXT = 'MP_NEXT',
  PREV = 'MP_PREV',
  STOP = 'MP_STOP',
  PAUSE = 'MP_PAUSE',
  SET_CURRENT_TRACK = 'MP_SET_CURRENT_TRACK',
  SET_QUEUE = 'MP_SET_QUEUE',
  SET_PROGRESS = 'MP_SET_PROGRESS',
}

type LoadPlaylistPayload = {
  playlist: string;
};

export const loadPlaylist = createAction<LoadPlaylistPayload>(
  MediaPlayerActionTypes.LOAD_PLAYLIST,
);

export type ActionLoadPlaylist = ActionWithPayload<
  MediaPlayerActionTypes.LOAD_PLAYLIST,
  LoadPlaylistPayload
>;

type PlayPayload = {
  track?: string;
  playlist?: string;
};

export const playTrack = createAction<PlayPayload>(MediaPlayerActionTypes.PLAY);

export type ActionPlay = ActionWithPayload<
  MediaPlayerActionTypes.PLAY,
  PlayPayload
>;

export const next = createAction(MediaPlayerActionTypes.NEXT);

export type ActionNext = ActionWithPayload<MediaPlayerActionTypes.NEXT>;

export const prev = createAction(MediaPlayerActionTypes.PREV);

export type ActionPrev = ActionWithPayload<MediaPlayerActionTypes.PREV>;

export const pause = createAction(MediaPlayerActionTypes.PAUSE);

export type ActionPause = ActionWithPayload<MediaPlayerActionTypes.PAUSE>;

export const stop = createAction(MediaPlayerActionTypes.STOP);

export type ActionStop = ActionWithPayload<MediaPlayerActionTypes.STOP>;

type SetCurrentTrackPayload = {
  track: string;
};

export const setCurrentTrack = createAction<SetCurrentTrackPayload>(
  MediaPlayerActionTypes.SET_CURRENT_TRACK,
);

export type ActionSetCurrentTrack = ActionWithPayload<
  MediaPlayerActionTypes.SET_CURRENT_TRACK,
  SetCurrentTrackPayload
>;

type SetQueuePayload = {
  tracks: string[];
  playlist: string;
};

export const setQueue = createAction<SetQueuePayload>(
  MediaPlayerActionTypes.SET_QUEUE,
);

export type ActionSetQueue = ActionWithPayload<
  MediaPlayerActionTypes.SET_QUEUE,
  SetQueuePayload
>;

type SetProgressPayload = {
  value: number;
};

export const setProgress = createAction<SetProgressPayload>(
  MediaPlayerActionTypes.SET_PROGRESS,
);

export type ActionSetProgress = ActionWithPayload<
  MediaPlayerActionTypes.SET_PROGRESS,
  SetProgressPayload
>;

export type MediaPlayerActions =
  | ActionLoadPlaylist
  | ActionPlay
  | ActionPause
  | ActionStop
  | ActionSetCurrentTrack
  | ActionSetQueue
  | ActionSetProgress;
