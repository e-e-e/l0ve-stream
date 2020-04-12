import {
  call,
  put,
  takeEvery,
  takeLatest,
  fork,
  all,
  getContext,
} from "redux-saga/effects";
import {
  ActionPlaylistsFetch,
  FETCH_PLAYLISTS,
  fetchPlaylistsError,
  fetchPlaylistsSuccess,
} from "../actions/actions";
import { GraphQueriesService } from "../../services/graphql/queries";

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
type PromisedReturnType<T extends (...args: any) => Promise<any>> = PromiseType<
  ReturnType<T>
>;

function* fetchUser(action: ActionPlaylistsFetch) {
  const queries: GraphQueriesService = yield getContext("queries");
  try {
    const data: PromisedReturnType<
      GraphQueriesService["playlists"]
    > = yield call(() => queries.playlists());
    yield put(fetchPlaylistsSuccess(data));
  } catch (e) {
    yield put(fetchPlaylistsError({ errorMessage: e.message }));
  }
}
export function* watchPlaylistFetch() {
  yield takeLatest(FETCH_PLAYLISTS, fetchUser);
}

export const rootSaga = function* root() {
  yield all([fork(watchPlaylistFetch)]);
};
