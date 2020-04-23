/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TrackInput } from "./../../../../__generated_types__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTrack
// ====================================================

export interface CreateTrack_createTrack_track {
  __typename: "Track";
  id: string | null;
}

export interface CreateTrack_createTrack {
  __typename: "TrackMutationResponse";
  message: string;
  success: boolean;
  track: CreateTrack_createTrack_track | null;
}

export interface CreateTrack {
  createTrack: CreateTrack_createTrack | null;
}

export interface CreateTrackVariables {
  playlistId?: string | null;
  data?: TrackInput | null;
  order?: number | null;
}
