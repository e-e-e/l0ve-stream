import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore } from "redux";
import { reducer } from "./reducers/reducers";
import { rootSaga } from "./sagas/sagas";
import { Provider } from "react-redux";
import React, { PropsWithChildren } from "react";
import { GraphQueriesService } from "../services/graphql/queries";
import { composeWithDevTools } from "redux-devtools-extension";
import {GraphMutationsService} from "../services/graphql/mutations";

export function installRedux({
  services,
}: {
  services: {
    queries: GraphQueriesService;
    mutations: GraphMutationsService;
  };
}) {
  const sagaMiddleware = createSagaMiddleware({
    context: { queries: services.queries, mutations: services.mutations},
  });

  const middleware = applyMiddleware(sagaMiddleware);
  const store = createStore(reducer, {}, composeWithDevTools(middleware));
  sagaMiddleware.run(rootSaga);
  return {
    ReduxProvider: ({ children }: PropsWithChildren<{}>) => (
      <Provider store={store}>{children}</Provider>
    ),
  };
}
