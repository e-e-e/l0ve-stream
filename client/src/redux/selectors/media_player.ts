import { RootState } from '../reducers/reducers';
import { selectTrack } from './playlists';

const selectPlayer = (state: RootState) => state.player;

export const getTimeInfo = (state: RootState) => {
  const { progress, elapsed, duration } = selectPlayer(state);
  return { progress, elapsed, duration };
};

export const getQueuedPlaylistId = (state: RootState) =>
  selectPlayer(state).playlist;

export const getCurrentTrack = (state: RootState) => {
  const playlistId = getQueuedPlaylistId(state);
  const trackId = selectPlayer(state).currentTrack;
  if (!playlistId || !trackId) return undefined;
  return selectTrack(playlistId, trackId)(state);
};
