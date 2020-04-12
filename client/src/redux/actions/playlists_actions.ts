import { Action } from "redux";
import { createAction } from "redux-actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";
import {
  FETCH_PLAYLISTS,
  FETCH_PLAYLISTS_ERROR,
  FETCH_PLAYLISTS_SUCCESS,
} from "./action_types";
import { ActionWithPayload } from "./types";

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

export type PlaylistActions =
  | ActionPlaylistsFetch
  | ActionPlaylistsFetchSuccess
  | ActionPlaylistsFetchError;
