import { PlaylistActions } from "../actions/playlists_actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";
import { groupByIds, LoadingState } from "./helpers";
import {
  FETCH_PLAYLIST,
  FETCH_PLAYLIST_ERROR,
  FETCH_PLAYLIST_SUCCESS,
  FETCH_PLAYLISTS,
  FETCH_PLAYLISTS_ERROR,
  FETCH_PLAYLISTS_SUCCESS,
  UPDATE_PLAYLIST_TRACK_ORDER,
} from "../actions/action_types";

type Playlist = Exclude<FetchPlaylists["playlists"], null>[number];
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
  errorMessage: "",
};

function move<T>(array: ReadonlyArray<T>, from: number, to: number): T[] {
  const a = [...array.slice(0, from), ...array.slice(from + 1)];
  a.splice(to, 0, array[from]);
  return a;
}

export function playlistReducer(
  state: PlaylistsState = initialState,
  action: PlaylistActions
): PlaylistsState {
  if (action.type === FETCH_PLAYLISTS) {
    return {
      ...state,
      state: LoadingState.LOADING,
      byId: {},
      allIds: [],
    };
  }
  if (action.type === FETCH_PLAYLISTS_SUCCESS) {
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
  if (action.type === FETCH_PLAYLISTS_ERROR) {
    return {
      ...state,
      state: LoadingState.ERROR,
      byId: {},
      allIds: [],
      errorMessage: action.payload.errorMessage,
    };
  }
  if (action.type === FETCH_PLAYLIST) {
    return {
      ...state,
      state: LoadingState.LOADING,
    };
  }
  if (action.type === FETCH_PLAYLIST_SUCCESS) {
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
  if (action.type === FETCH_PLAYLIST_ERROR) {
    return {
      ...state,
      state: LoadingState.ERROR,
      errorMessage: action.payload.errorMessage,
    };
  }
  if (action.type === UPDATE_PLAYLIST_TRACK_ORDER) {
    const { playlistId, from, to } = action.payload;
    const playlist = state.byId[playlistId];
    if (!playlist.tracks) return state;
    return {
      ...state,
      byId: {
        ...state.byId,
        [playlist.id]: { ...playlist, tracks: move(playlist.tracks, from, to) },
      },
    };
  }
  return state;
}
