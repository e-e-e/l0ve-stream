import { createAction } from "redux-actions";
import { ActionWithPayload } from "./types";
import { FetchPlaylists } from "../../services/graphql/__generated_types__/FetchPlaylists";
import { FetchPlaylist } from "../../services/graphql/__generated_types__/FetchPlaylist";
import { UpdatePlaylist } from "../../services/graphql/__generated_types__/UpdatePlaylist";

export enum PlaylistActionTypes {
  SYNC_PLAYLIST = "SYNC_PLAYLIST",
  SYNC_PLAYLIST_SUCCESS = "SYNC_PLAYLIST_SUCCESS",
  SYNC_PLAYLIST_ERROR = "SYNC_PLAYLIST_ERROR",
  FETCH_PLAYLISTS = "FETCH_PLAYLISTS",
  FETCH_PLAYLISTS_SUCCESS = "PLAYLISTS_FETCH_SUCCESS",
  FETCH_PLAYLISTS_ERROR = "PLAYLISTS_FETCH_ERROR",
  FETCH_PLAYLIST = "FETCH_PLAYLIST",
  FETCH_PLAYLIST_SUCCESS = "FETCH_PLAYLIST_SUCCESS",
  FETCH_PLAYLIST_ERROR = "FETCH_PLAYLIST_ERROR",
  UPDATE_PLAYLIST_TRACK_ORDER = "UPDATE_PLAYLIST_TRACK_ORDER",
  INSERT_PLAYLIST_TRACK = "INSERT_PLAYLIST_TRACK",
  DELETE_PLAYLIST_TRACK = "DELETE_PLAYLIST_TRACK",
  DELETE_PLAYLIST = "DELETE_PLAYLIST",
  CREATE_PLAYLIST = "CREATE_PLAYLIST",
}
/*
 * SYNC PLAYLIST ACTIONS
 */
type SyncPlaylist = {
  playlist: Exclude<
    Exclude<UpdatePlaylist["updatePlaylist"], null>["playlist"],
    null
  >;
};
export const syncPlaylist = createAction(PlaylistActionTypes.SYNC_PLAYLIST);
export const syncPlaylistSuccess = createAction<SyncPlaylist>(
  PlaylistActionTypes.SYNC_PLAYLIST_SUCCESS
);
export const syncPlaylistError = createAction<{ errorMessage: any }>(
  PlaylistActionTypes.SYNC_PLAYLIST_ERROR
);

export type ActionPlaylistsSync = ActionWithPayload<
  PlaylistActionTypes.SYNC_PLAYLIST
>;
export type ActionPlaylistsSyncSuccess = ActionWithPayload<
  PlaylistActionTypes.SYNC_PLAYLIST_SUCCESS,
  SyncPlaylist
>;
export type ActionPlaylistsSyncError = ActionWithPayload<
  PlaylistActionTypes.SYNC_PLAYLIST_ERROR,
  { errorMessage: string }
>;
/*
 * FETCH PLAYLISTS ACTIONS
 */
export const fetchPlaylists = createAction(PlaylistActionTypes.FETCH_PLAYLISTS);
export const fetchPlaylistsSuccess = createAction<FetchPlaylists>(
  PlaylistActionTypes.FETCH_PLAYLISTS_SUCCESS
);
export const fetchPlaylistsError = createAction<{ errorMessage: any }>(
  PlaylistActionTypes.FETCH_PLAYLISTS_ERROR
);

export type ActionPlaylistsFetch = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLISTS
>;
export type ActionPlaylistsFetchSuccess = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLISTS_SUCCESS,
  FetchPlaylists
>;
export type ActionPlaylistsFetchError = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLISTS_ERROR,
  { errorMessage: string }
>;

/*
 * FETCH PLAYLIST ACTIONS
 */
export const fetchPlaylist = createAction<{ id: string }>(
  PlaylistActionTypes.FETCH_PLAYLIST
);
export const fetchPlaylistSuccess = createAction<FetchPlaylist>(
  PlaylistActionTypes.FETCH_PLAYLIST_SUCCESS
);
export const fetchPlaylistError = createAction<{ errorMessage: any }>(
  PlaylistActionTypes.FETCH_PLAYLIST_ERROR
);

export type ActionPlaylistFetch = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLIST,
  { id: string }
>;
export type ActionPlaylistFetchSuccess = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLIST_SUCCESS,
  FetchPlaylist
>;
export type ActionPlaylistFetchError = ActionWithPayload<
  PlaylistActionTypes.FETCH_PLAYLIST_ERROR,
  { errorMessage: string }
>;

/**
 * UPDATE PLAYLIST TRACK ORDER
 */
type UpdatePlaylistTrackOrderPayload = {
  playlistId: string;
  from: number;
  to: number;
};
export const updatePlaylistTrackOrder = createAction<
  UpdatePlaylistTrackOrderPayload
>(PlaylistActionTypes.UPDATE_PLAYLIST_TRACK_ORDER);
export type ActionUpdatePlaylistTrackOrder = ActionWithPayload<
  PlaylistActionTypes.UPDATE_PLAYLIST_TRACK_ORDER,
  UpdatePlaylistTrackOrderPayload
>;

/**
 * INSERT NEW TRACK
 */
type InsertPlaylistTrackPayload = {
  playlistId: string;
  track: {
    title: string;
    album: string;
    artist: string;
  };
};
export const insertPlaylistTrack = createAction<InsertPlaylistTrackPayload>(
  PlaylistActionTypes.INSERT_PLAYLIST_TRACK
);
export type ActionInsertPlaylistTrack = ActionWithPayload<
  PlaylistActionTypes.INSERT_PLAYLIST_TRACK,
  InsertPlaylistTrackPayload
>;
/**
 * DELETE TRACK FROM PLAYLIST
 */
type DeletePlaylistTrackPayload = {
  playlistId: string;
  trackId: string;
};
export const deletePlaylistTrack = createAction<DeletePlaylistTrackPayload>(
  PlaylistActionTypes.DELETE_PLAYLIST_TRACK
);
export type ActionDeletePlaylistTrack = ActionWithPayload<
  PlaylistActionTypes.DELETE_PLAYLIST_TRACK,
  DeletePlaylistTrackPayload
>;

/**
 * DELETE PLAYLIST
 */
type DeletePlaylistPayload = {
  playlistId: string;
};
export const deletePlaylist = createAction<DeletePlaylistPayload>(
  PlaylistActionTypes.DELETE_PLAYLIST
);
export type ActionDeletePlaylist = ActionWithPayload<
  PlaylistActionTypes.DELETE_PLAYLIST,
  DeletePlaylistPayload
>;

/**
 * CREATE PLAYLIST
 */
type CreatePlaylistPayload = {
  title: string;
  description: string;
};
export const createPlaylist = createAction<CreatePlaylistPayload>(
  PlaylistActionTypes.CREATE_PLAYLIST
);
export type ActionCreatePlaylist = ActionWithPayload<
  PlaylistActionTypes.CREATE_PLAYLIST,
  CreatePlaylistPayload
>;
/*
 *  ALL VALID REDUCER ACTIONS
 */
export type PlaylistActions =
  | ActionPlaylistsSync
  | ActionPlaylistsSyncSuccess
  | ActionPlaylistsSyncError
  | ActionPlaylistsFetch
  | ActionPlaylistsFetchSuccess
  | ActionPlaylistsFetchError
  | ActionPlaylistFetch
  | ActionPlaylistFetchSuccess
  | ActionPlaylistFetchError
  | ActionUpdatePlaylistTrackOrder
  | ActionInsertPlaylistTrack
  | ActionDeletePlaylistTrack
  | ActionDeletePlaylist
  | ActionCreatePlaylist;
