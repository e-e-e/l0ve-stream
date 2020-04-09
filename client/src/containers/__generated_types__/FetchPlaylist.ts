/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchPlaylist
// ====================================================

export interface FetchPlaylist_playlist_tracks {
  __typename: "Track";
  id: string | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  genre: string | null;
}

export interface FetchPlaylist_playlist_owner {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface FetchPlaylist_playlist {
  __typename: "Playlist";
  id: string | null;
  title: string | null;
  description: string | null;
  tracks: (FetchPlaylist_playlist_tracks | null)[] | null;
  owner: FetchPlaylist_playlist_owner | null;
}

export interface FetchPlaylist {
  playlist: FetchPlaylist_playlist | null;
}

export interface FetchPlaylistVariables {
  id?: string | null;
}
