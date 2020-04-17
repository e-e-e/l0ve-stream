/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePlaylist
// ====================================================

export interface DeletePlaylist_deletePlaylist {
  __typename: "PlainMutationResponse";
  message: string;
  success: boolean;
}

export interface DeletePlaylist {
  deletePlaylist: DeletePlaylist_deletePlaylist | null;
}

export interface DeletePlaylistVariables {
  id?: string | null;
}
