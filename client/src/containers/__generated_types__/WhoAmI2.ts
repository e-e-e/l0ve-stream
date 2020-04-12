/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: WhoAmI2
// ====================================================

export interface WhoAmI2_whoami {
  __typename: "User";
  id: string | null;
  name: string | null;
  role: string | null;
}

export interface WhoAmI2 {
  whoami: WhoAmI2_whoami | null;
}
