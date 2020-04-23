/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlaylistInputWithId } from "./../../../../__generated_types__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePlaylist
// ====================================================

export interface UpdatePlaylist_updatePlaylist_playlist_tracks_files {
  __typename: "File";
  id: string | null;
  filename: string | null;
  status: string | null;
}

export interface UpdatePlaylist_updatePlaylist_playlist_tracks {
  __typename: "Track";
  id: string | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  genre: string | null;
  files: UpdatePlaylist_updatePlaylist_playlist_tracks_files[] | null;
}

export interface UpdatePlaylist_updatePlaylist_playlist_owner {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface UpdatePlaylist_updatePlaylist_playlist {
  __typename: "Playlist";
  id: string;
  title: string | null;
  description: string | null;
  tracks: UpdatePlaylist_updatePlaylist_playlist_tracks[] | null;
  owner: UpdatePlaylist_updatePlaylist_playlist_owner | null;
}

export interface UpdatePlaylist_updatePlaylist {
  __typename: "PlaylistMutationResponse";
  message: string;
  success: boolean;
  playlist: UpdatePlaylist_updatePlaylist_playlist | null;
}

export interface UpdatePlaylist {
  updatePlaylist: UpdatePlaylist_updatePlaylist | null;
}

export interface UpdatePlaylistVariables {
  playlist?: PlaylistInputWithId | null;
}
