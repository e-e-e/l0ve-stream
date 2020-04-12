import { Action } from "redux";
import { createAction } from "redux-actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";
import {
  FETCH_PLAYLIST,
  FETCH_PLAYLIST_ERROR,
  FETCH_PLAYLIST_SUCCESS,
  FETCH_PLAYLISTS,
  FETCH_PLAYLISTS_ERROR,
  FETCH_PLAYLISTS_SUCCESS,
} from "./action_types";
import { ActionWithPayload } from "./types";
import { FetchPlaylist } from "../../services/graphql/__generated_types__/FetchPlaylist";

export const fetchPlaylists = createAction(FETCH_PLAYLISTS);
export const fetchPlaylistsSuccess = createAction<FetchPlaylists>(
  FETCH_PLAYLISTS_SUCCESS
);
export const fetchPlaylistsError = createAction<{ errorMessage: any }>(
  FETCH_PLAYLISTS_ERROR
);

export type ActionPlaylistsFetch = ActionWithPayload<typeof FETCH_PLAYLISTS>;
export type ActionPlaylistsFetchSuccess = ActionWithPayload<
  typeof FETCH_PLAYLISTS_SUCCESS,
  FetchPlaylists
>;
export type ActionPlaylistsFetchError = ActionWithPayload<
  typeof FETCH_PLAYLISTS_ERROR,
  { errorMessage: string }
>;

export const fetchPlaylist = createAction<{ id: string }>(FETCH_PLAYLIST);
export const fetchPlaylistSuccess = createAction<FetchPlaylist>(
  FETCH_PLAYLIST_SUCCESS
);
export const fetchPlaylistError = createAction<{ errorMessage: any }>(
  FETCH_PLAYLIST_ERROR
);

export type ActionPlaylistFetch = ActionWithPayload<typeof FETCH_PLAYLIST, { id: string }>;
export type ActionPlaylistFetchSuccess = ActionWithPayload<
  typeof FETCH_PLAYLIST_SUCCESS,
  FetchPlaylist
>;
export type ActionPlaylistFetchError = ActionWithPayload<
  typeof FETCH_PLAYLIST_ERROR,
  { errorMessage: string }
>;

export type PlaylistActions =
  | ActionPlaylistsFetch
  | ActionPlaylistsFetchSuccess
  | ActionPlaylistsFetchError
  | ActionPlaylistFetch
  | ActionPlaylistFetchSuccess
  | ActionPlaylistFetchError;
