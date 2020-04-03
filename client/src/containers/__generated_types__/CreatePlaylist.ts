/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TrackInput } from "./../../../__generated_types__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePlaylist
// ====================================================

export interface CreatePlaylist_createPlaylist_playlist {
  __typename: "Playlist";
  id: string | null;
}

export interface CreatePlaylist_createPlaylist {
  __typename: "PlaylistMutationResponse";
  message: string;
  success: boolean;
  playlist: CreatePlaylist_createPlaylist_playlist | null;
}

export interface CreatePlaylist {
  createPlaylist: CreatePlaylist_createPlaylist | null;
}

export interface CreatePlaylistVariables {
  title: string;
  description: string;
  tracks?: (TrackInput | null)[] | null;
}
