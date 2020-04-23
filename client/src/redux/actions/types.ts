import { Action } from "redux";

export type ActionWithPayload<T extends string, P = never> = [P] extends [never]
  ? Action<T>
  : Action<T> & { payload: P };
