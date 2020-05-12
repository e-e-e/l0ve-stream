import { RootState } from '../reducers/reducers';

export const x = {};

const getUiState = (state: RootState) => state.ui;

const getFileUploads = (state: RootState) => getUiState(state).fileUploads;

export const getFileUpload = (trackId?: string) => (state: RootState) => {
  if (!trackId) return undefined;
  return getFileUploads(state).find((f) => f.trackId === trackId);
};
