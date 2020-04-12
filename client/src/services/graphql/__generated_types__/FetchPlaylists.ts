/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchPlaylists
// ====================================================

export interface FetchPlaylists_playlists_tracks {
  __typename: "Track";
  id: string | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  genre: string | null;
}

export interface FetchPlaylists_playlists_owner {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface FetchPlaylists_playlists {
  __typename: "Playlist";
  id: string;
  title: string | null;
  description: string | null;
  tracks: (FetchPlaylists_playlists_tracks | null)[] | null;
  owner: FetchPlaylists_playlists_owner | null;
}

export interface FetchPlaylists {
  playlists: FetchPlaylists_playlists[] | null;
}
