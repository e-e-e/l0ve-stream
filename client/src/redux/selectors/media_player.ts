import { RootState } from "../reducers/reducers";

const selectPlayer = (state: RootState) => state.player;
export const selectProgress = (state: RootState) =>
  selectPlayer(state).progress;
