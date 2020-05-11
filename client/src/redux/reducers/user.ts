import {
  FETCH_WHOAMI,
  FETCH_WHOAMI_ERROR,
  FETCH_WHOAMI_SUCCESS,
} from '../actions/action_types';
import { LoadingState } from './helpers';
import { WhoAmI } from '../../services/graphql/__generated_types__/WhoAmI';
import { UserActions } from '../actions/user_actions';

export type UserState = {
  state: LoadingState;
  whoami: WhoAmI['whoami'];
  errorMessage: string | null;
};

const initialState = {
  state: LoadingState.INITIAL,
  whoami: null,
  errorMessage: null,
};

export function userReducer(
  state: UserState = initialState,
  action: UserActions,
): UserState {
  if (action.type === FETCH_WHOAMI) {
    return {
      ...state,
      state: LoadingState.LOADING,
      whoami: null,
      errorMessage: null,
    };
  }
  if (action.type === FETCH_WHOAMI_SUCCESS) {
    console.log('data', action.payload);
    const whoami = action.payload.whoami;
    if (whoami === null) {
      return state;
    }
    return {
      ...state,
      whoami,
      state: LoadingState.LOADED,
      errorMessage: null,
    };
  }
  if (action.type === FETCH_WHOAMI_ERROR) {
    return {
      ...state,
      state: LoadingState.ERROR,
      whoami: null,
      errorMessage: action.payload.errorMessage,
    };
  }
  return state;
}
