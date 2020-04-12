import { createAction } from "redux-actions";
import { WhoAmI } from "../../services/graphql/__generated_types__/WhoAmI";
import {
  FETCH_WHOAMI,
  FETCH_WHOAMI_ERROR,
  FETCH_WHOAMI_SUCCESS,
} from "./action_types";
import { ActionWithPayload } from "./types";

export const fetchWhoAmI = createAction(FETCH_WHOAMI);
export const fetchWhoAmISuccess = createAction<WhoAmI>(FETCH_WHOAMI_SUCCESS);
export const fetchWhoAmIError = createAction<{ errorMessage: any }>(
  FETCH_WHOAMI_ERROR
);

export type ActionWhoAmIFetch = ActionWithPayload<typeof FETCH_WHOAMI>;

export type ActionWhoAmIFetchSuccess = ActionWithPayload<
  typeof FETCH_WHOAMI_SUCCESS,
  WhoAmI
>;

export type ActionWhoAmIFetchError = ActionWithPayload<
  typeof FETCH_WHOAMI_ERROR,
  { errorMessage: string }
>;

export type UserActions =
  | ActionWhoAmIFetch
  | ActionWhoAmIFetchSuccess
  | ActionWhoAmIFetchError;
