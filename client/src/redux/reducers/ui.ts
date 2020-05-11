import { UiActions, UiActionTypes } from '../actions/ui_actions';
import { produce } from 'immer';

enum UploadStatus {
  PROGRESS,
  SUCCESS,
  ERROR,
}

type FileUploadState = {
  playlistId: string;
  trackId: string;
  filename: string;
  progress: number;
  status: UploadStatus;
  error?: string;
};

export type UiState = {
  fileUploads: FileUploadState[];
};

const initialState = {
  fileUploads: [],
};

export function uiReducer(
  state: UiState = initialState,
  action: UiActions,
): UiState {
  switch (action.type) {
    case UiActionTypes.UPLOAD_REQUEST: {
      const { playlistId, trackId, filename } = action.payload;
      const fileUpload = {
        playlistId,
        trackId,
        filename,
        progress: 0,
        status: UploadStatus.PROGRESS,
        error: undefined,
      };
      return produce(state, (draft) => {
        draft.fileUploads.push(fileUpload);
      });
    }
    case UiActionTypes.UPLOAD_PROGRESS: {
      const { progress, filename } = action.payload;
      const index = state.fileUploads.findIndex((a) => a.filename);
      if (index === -1)
        throw new Error('Progress event for non-existent upload');
      return produce(state, (draft) => {
        const upload = draft.fileUploads.find((a) => a.filename === filename);
        if (!upload) {
          console.warn('Progress event for non-existent upload');
          return;
        }
        upload.progress = progress;
      });
    }
    case UiActionTypes.UPLOAD_SUCCESS: {
      const { filename } = action.payload;
      return produce(state, (draft) => {
        const upload = draft.fileUploads.find((a) => a.filename === filename);
        if (!upload) {
          console.warn('Success event for non-existent upload');
          return;
        }
        upload.progress = 1;
        upload.status = UploadStatus.SUCCESS;
        upload.error = undefined;
      });
    }
    case UiActionTypes.UPLOAD_ERROR: {
      const { filename, error } = action.payload;
      return produce(state, (draft) => {
        const upload = draft.fileUploads.find((a) => a.filename === filename);
        if (!upload) {
          console.warn('Error event for non-existent upload');
          return;
        }
        upload.progress = 1;
        upload.error = error;
        upload.status = UploadStatus.ERROR;
      });
    }
  }
  return state;
}
