/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TrackInfo
// ====================================================

export interface TrackInfo_files {
  __typename: "File";
  id: string | null;
  filename: string | null;
  status: string | null;
}

export interface TrackInfo {
  __typename: "Track";
  id: string | null;
  title: string | null;
  album: string | null;
  artist: string | null;
  year: number | null;
  genre: string | null;
  duration: number | null;
  files: TrackInfo_files[] | null;
}
