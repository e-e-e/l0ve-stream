import { Action } from "redux";
import { createAction } from "redux-actions";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";

export const FETCH_PLAYLISTS = "FETCH_PLAYLISTS";
export const FETCH_PLAYLISTS_SUCCESS = "PLAYLISTS_FETCH_SUCCESS";
export const FETCH_PLAYLISTS_ERROR = "PLAYLISTS_FETCH_ERROR";

type ActionWithPayload<T extends string, P = never> = [P] extends [never]
  ? Action<T>
  : Action<T> & { payload: P };

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

export type AppActions =
  | ActionPlaylistsFetch
  | ActionPlaylistsFetchSuccess
  | ActionPlaylistsFetchError;
