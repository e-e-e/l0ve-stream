import { RootState } from '../reducers/reducers';
import { LoadingState } from '../reducers/helpers';

const selectPlaylists = (state: RootState) => state.entities.playlists;

export const selectPlaylist = (id: string) => (state: RootState) =>
  selectPlaylists(state).byId[id];

export const selectTrack = (playlistId: string, trackId: string) => (
  state: RootState,
) => {
  return selectPlaylist(playlistId)(state).tracks?.find(
    (track) => track.id === trackId,
  );
};

export const selectTracksWithFiles = (playlistId: string) => (
  state: RootState,
) => {
  const playlist = selectPlaylist(playlistId)(state);
  if (!playlist) return [];
  return (
    playlist.tracks?.filter((track) => track && track?.files?.length) ?? []
  );
};

export const selectTracks = (playlistId: string) => (state: RootState) => {
  const playlist = selectPlaylist(playlistId)(state);
  if (!playlist) return [];
  return playlist.tracks || [];
};

export const selectPlaylistDuration = (id: string) => (state: RootState) =>
  selectTracks(id)(state).reduce((acc, t) => {
    return acc + (t.duration || 0);
  }, 0);

export const selectError = (state: RootState) =>
  selectPlaylists(state).state === LoadingState.ERROR &&
  selectPlaylists(state).errorMessage;

export const selectIsLoading = (state: RootState) =>
  selectPlaylists(state).state === LoadingState.LOADING;
