import {
  call,
  put,
  takeLatest,
  fork,
  all,
  getContext,
} from "redux-saga/effects";
import { fetchWhoAmIError, fetchWhoAmISuccess } from "../actions/user_actions";
import { GraphQueriesService } from "../../services/graphql/queries";
import {
  FETCH_WHOAMI,
} from "../actions/action_types";

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
type PromisedReturnType<T extends (...args: any) => Promise<any>> = PromiseType<
  ReturnType<T>
>;

function* fetchWhoAmI() {
  const queries: GraphQueriesService = yield getContext("queries");
  try {
    const data: PromisedReturnType<
      GraphQueriesService["whoAmI"]
    > = yield call(() => queries.whoAmI());
    yield put(fetchWhoAmISuccess(data));
  } catch (e) {
    yield put(fetchWhoAmIError({ errorMessage: e.message }));
  }
}
function* watchWhoAmIFetch() {
  yield takeLatest(FETCH_WHOAMI, fetchWhoAmI);
}

export const userSagas = function* userSagas() {
  yield all([fork(watchWhoAmIFetch)]);
};
