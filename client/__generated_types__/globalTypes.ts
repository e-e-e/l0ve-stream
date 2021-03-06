/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface PlaylistInputWithId {
  id: string;
  title?: string | null;
  description?: string | null;
  tracks?: TrackInputWithOptionalId[] | null;
}

export interface TrackInput {
  title: string;
  artist: string;
  album: string;
  genre?: string | null;
  year?: number | null;
  duration?: number | null;
}

export interface TrackInputWithOptionalId {
  id?: string | null;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  genre?: string | null;
  year?: number | null;
  duration?: number | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
