import {
  AppActions,
  FETCH_PLAYLISTS,
  FETCH_PLAYLISTS_ERROR,
  FETCH_PLAYLISTS_SUCCESS,
} from "../actions/actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";

type Playlist = Exclude<FetchPlaylists["playlists"], null>[number];
type PlaylistsDict = { [Key: string]: Playlist };
type PlaylistsState = {
  state: "LOADING" | "LOADED" | "ERROR";
  byId: PlaylistsDict;
  allIds: string[];
  errorMessage: string;
};

type GroupedById<T> = { byId: Record<string, T>; allIds: string[] };
function groupByIds<T extends { id: string }>(data: T[]): GroupedById<T> {
  return data.reduce(
    (p: GroupedById<T>, c: T) => {
      p.byId[c.id] = c;
      p.allIds.push(c.id);
      return p;
    },
    { byId: {}, allIds: [] }
  );
}

const initialState = {
  state: "LOADING" as const,
  byId: {},
  allIds: [],
  errorMessage: "",
};

export function playlistReducer(
  state: PlaylistsState = initialState,
  action: AppActions
): PlaylistsState {
  if (action.type === FETCH_PLAYLISTS) {
    return {
      ...state,
      state: "LOADING",
      byId: {},
      allIds: [],
    };
  }
  if (action.type === FETCH_PLAYLISTS_SUCCESS) {
    // action.payload.playlists
    console.log("data", action.payload);
    const playlists = action.payload.playlists;
    if (playlists === null) {
      return state;
    }
    return {
      ...state,
      state: "LOADED",
      ...groupByIds(playlists),
    };
  }
  if (action.type === FETCH_PLAYLISTS_ERROR) {
    return {
      ...state,
      state: "ERROR",
      byId: {},
      allIds: [],
      errorMessage: action.payload.errorMessage,
    };
  }
  return state;
}
