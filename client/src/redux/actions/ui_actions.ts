import { createAction } from "redux-actions";
import { ActionWithPayload } from "./types";

export enum UiActionTypes {
  UPLOAD_REQUEST = "UPLOAD_REQUEST",
  UPLOAD_PROGRESS = "UPLOAD_PROGRESS",
  UPLOAD_SUCCESS = "UPLOAD_SUCCESS",
  UPLOAD_ERROR = "UPLOAD_ERROR",
}

export type UploadRequestPayload = {
  playlistId: string;
  trackId: string;
  filename: string;
  endpoint: string;
  file: File;
};

export const uploadRequest = createAction<UploadRequestPayload>(
  UiActionTypes.UPLOAD_REQUEST
);
export type ActionUploadRequest = ActionWithPayload<
  UiActionTypes.UPLOAD_REQUEST,
  UploadRequestPayload
>;

type UploadProgressPayload = {
  filename: string;
  progress: number;
};

export const uploadProgress = createAction<UploadProgressPayload>(
  UiActionTypes.UPLOAD_PROGRESS
);
export type ActionUploadProgress = ActionWithPayload<
  UiActionTypes.UPLOAD_PROGRESS,
  UploadProgressPayload
>;

type UploadSuccessPayload = {
  filename: string;
};

export const uploadSuccess = createAction<UploadSuccessPayload>(
  UiActionTypes.UPLOAD_SUCCESS
);
export type ActionUploadSuccess = ActionWithPayload<
  UiActionTypes.UPLOAD_SUCCESS,
  UploadSuccessPayload
>;

type UploadErrorPayload = {
  filename: string;
  error: string;
};

export const uploadError = createAction<UploadErrorPayload>(
  UiActionTypes.UPLOAD_ERROR
);
export type ActionUploadError = ActionWithPayload<
  UiActionTypes.UPLOAD_ERROR,
  UploadErrorPayload
>;

export type UiActions =
  | ActionUploadRequest
  | ActionUploadProgress
  | ActionUploadSuccess
  | ActionUploadError;
