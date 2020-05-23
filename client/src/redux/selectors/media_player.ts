import { RootState } from '../reducers/reducers';
import {
  selectPlaylist,
  selectPlaylistDuration,
  selectTrack,
} from './playlists';

const selectPlayer = (state: RootState) => state.player;

export const getTimeInfo = (state: RootState) => {
  const { progress, elapsed, duration } = selectPlayer(state);
  return { progress, elapsed, duration };
};

export const getTotalProgress = (state: RootState) => {
  const { currentTrack, queue, elapsed, playlist } = selectPlayer(state);
  if (!playlist) return 0;
  const indexOfCurrentTrack = queue.findIndex((x) => x.id === currentTrack);
  if (!indexOfCurrentTrack) return 0;
  const totalDuration = selectPlaylistDuration(playlist)(state)
  if (totalDuration === 0) return 0;
  let currentDuration = elapsed;
  console.log('index', indexOfCurrentTrack)
  for (let i = 0; i < indexOfCurrentTrack; i++) {
    console.log('que:', queue[i].id, selectTrack(playlist, queue[i].id)(state));
    currentDuration += selectTrack(playlist, queue[i].id)(state)?.duration ?? 0;
  }
  return currentDuration / totalDuration;
};

export const getQueuedPlaylistId = (state: RootState) =>
  selectPlayer(state).playlist;

export const getCurrentTrack = (state: RootState) => {
  const playlistId = getQueuedPlaylistId(state);
  const trackId = selectPlayer(state).currentTrack;
  if (!playlistId || !trackId) return undefined;
  return selectTrack(playlistId, trackId)(state);
};
