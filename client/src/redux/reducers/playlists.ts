import {
  PlaylistActions,
  PlaylistActionTypes,
} from '../actions/playlists_actions';
import { FetchPlaylists } from '../../services/graphql/__generated_types__/FetchPlaylists';
import { groupByIds, LoadingState } from './helpers';
import { produce } from 'immer';
import { selectTrack } from '../selectors/playlists';

export type Playlist = Exclude<FetchPlaylists['playlists'], null>[number];
type PlaylistsDict = { [Key: string]: Playlist };

export type PlaylistsState = {
  state: LoadingState;
  byId: PlaylistsDict;
  allIds: string[];
  errorMessage: string;
};

const initialState = {
  state: LoadingState.INITIAL,
  byId: {},
  allIds: [],
  errorMessage: '',
};

function move<T>(array: ReadonlyArray<T>, from: number, to: number): T[] {
  const a = [...array.slice(0, from), ...array.slice(from + 1)];
  a.splice(to, 0, array[from]);
  return a;
}

const defaultTrack = {
  __typename: 'Track' as const,
  id: null,
  title: null,
  album: null,
  artist: null,
  year: null,
  duration: null,
  genre: null,
  files: null,
};

export function playlistReducer(
  state: PlaylistsState = initialState,
  action: PlaylistActions,
): PlaylistsState {
  switch (action.type) {
    case PlaylistActionTypes.FETCH_PLAYLISTS:
      return {
        ...state,
        state: LoadingState.LOADING,
        byId: {},
        allIds: [],
      };
    case PlaylistActionTypes.FETCH_PLAYLISTS_SUCCESS: {
      const playlists = action.payload.playlists;
      if (playlists === null) {
        return state;
      }
      return {
        ...state,
        state: LoadingState.LOADED,
        ...groupByIds(playlists),
      };
    }
    case PlaylistActionTypes.FETCH_PLAYLISTS_ERROR:
      return {
        ...state,
        state: LoadingState.ERROR,
        byId: {},
        allIds: [],
        errorMessage: action.payload.errorMessage,
      };
    case PlaylistActionTypes.SYNC_PLAYLIST:
      return {
        ...state,
        state: LoadingState.SYNCING,
      };
    case PlaylistActionTypes.FETCH_PLAYLIST:
      return {
        ...state,
        state: LoadingState.LOADING,
      };
    case PlaylistActionTypes.SYNC_PLAYLIST_SUCCESS:
    case PlaylistActionTypes.FETCH_PLAYLIST_SUCCESS: {
      const playlist = action.payload.playlist;
      if (playlist === null) {
        return state;
      }
      return {
        ...state,
        state: LoadingState.LOADED,
        byId: {
          ...state.byId,
          [playlist.id]: playlist,
        },
        allIds: state.allIds.includes(playlist.id)
          ? state.allIds
          : [...state.allIds, playlist.id],
      };
    }
    case PlaylistActionTypes.SYNC_PLAYLIST_ERROR:
    case PlaylistActionTypes.FETCH_PLAYLIST_ERROR:
      return {
        ...state,
        state: LoadingState.ERROR,
        errorMessage: action.payload.errorMessage,
      };
    case PlaylistActionTypes.DELETE_PLAYLIST: {
      const { playlistId } = action.payload;
      return {
        ...state,
        byId: Object.keys(state.byId).reduce<PlaylistsDict>((p, c) => {
          if (c !== playlistId) p[c] = state.byId[c];
          return p;
        }, {}),
        allIds: state.allIds.filter((f) => f !== playlistId),
      };
    }
    case PlaylistActionTypes.DELETE_PLAYLIST_TRACK: {
      const { playlistId, trackId } = action.payload;
      const playlist = state.byId[playlistId];
      if (!playlist.tracks) return state;
      return {
        ...state,
        byId: {
          ...state.byId,
          [playlist.id]: {
            ...playlist,
            tracks: playlist.tracks.filter((t) => t.id !== trackId),
          },
        },
      };
    }
    case PlaylistActionTypes.UPDATE_PLAYLIST_TRACK_ORDER: {
      const { playlistId, from, to } = action.payload;
      const playlist = state.byId[playlistId];
      if (!playlist.tracks) return state;
      return {
        ...state,
        byId: {
          ...state.byId,
          [playlist.id]: {
            ...playlist,
            tracks: move(playlist.tracks, from, to),
          },
        },
      };
    }
    case PlaylistActionTypes.INSERT_PLAYLIST_TRACK: {
      const { playlistId, track } = action.payload;
      const playlist = state.byId[playlistId];
      const trackData = {
        ...defaultTrack,
        ...track,
      };
      return {
        ...state,
        byId: {
          ...state.byId,
          [playlist.id]: {
            ...playlist,
            tracks: playlist.tracks
              ? [...playlist.tracks, trackData]
              : [trackData],
          },
        },
      };
    }
    case PlaylistActionTypes.UPDATE_PLAYLIST_TRACK: {
      const { playlistId, track } = action.payload;
      return produce(state, (draft) => {
        const item = draft.byId[playlistId];
        if (!item || !item.tracks) return;
        const index = item.tracks.findIndex((t) => t.id === track.id);
        if (index < 0) return;
        item.tracks[index] = { ...item.tracks[index], ...track };
      });
    }
    case PlaylistActionTypes.UPDATE_PLAYLIST_TRACK_TRANSCODING_STATUS: {
      const { trackId, fileId, playlistId, status } = action.payload;
      return produce(state, (draft) => {
        const track = draft.byId[playlistId]?.tracks?.find(
          (t) => t.id === trackId,
        );
        const file = track?.files?.find((file) => file.id === fileId);
        if (file) {
          file.status = status.toString();
        }
      });
    }
  }
  return state;
}
