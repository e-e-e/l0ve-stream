/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PlaylistInfo
// ====================================================

export interface PlaylistInfo_tracks_files {
  __typename: "File";
  id: string | null;
  filename: string | null;
  status: string | null;
}

export interface PlaylistInfo_tracks {
  __typename: "Track";
  id: string | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  genre: string | null;
  files: PlaylistInfo_tracks_files[] | null;
}

export interface PlaylistInfo_owner {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface PlaylistInfo {
  __typename: "Playlist";
  id: string;
  title: string | null;
  description: string | null;
  tracks: PlaylistInfo_tracks[] | null;
  owner: PlaylistInfo_owner | null;
}
