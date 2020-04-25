import { RootState } from "../reducers/reducers";
import { LoadingState } from "../reducers/helpers";

const selectPlaylists = (state: RootState) => state.entities.playlists;

export const selectPlaylist = (id: string) => (state: RootState) =>
  selectPlaylists(state).byId[id];
export const selectError = (state: RootState) =>
  selectPlaylists(state).state === LoadingState.ERROR &&
  selectPlaylists(state).errorMessage;
export const selectIsLoading = (state: RootState) =>
  selectPlaylists(state).state === LoadingState.LOADING;
