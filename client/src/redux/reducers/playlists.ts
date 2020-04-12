import {
  PlaylistActions,
} from "../actions/playlists_actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";
import { groupByIds, LoadingState } from "./helpers";
import {
  FETCH_PLAYLISTS,
  FETCH_PLAYLISTS_ERROR,
  FETCH_PLAYLISTS_SUCCESS,
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
  return state;
}
