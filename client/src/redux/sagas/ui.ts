import { all, fork, takeEvery, call, put, take } from 'redux-saga/effects';
import {
  ActionUploadRequest,
  UiActionTypes,
  uploadError,
  uploadProgress,
  UploadRequestPayload,
  uploadSuccess,
} from '../actions/ui_actions';
import { eventChannel, END, buffers } from 'redux-saga';

function createUploadFileChannel(endpoint: string, file: File) {
  console.log(file);
  return eventChannel((emitter) => {
    const xhr = new XMLHttpRequest();
    const onProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) {
        const progress = e.loaded / e.total;
        emitter({ progress });
      }
    };
    const onFailure = (e?: ProgressEvent) => {
      console.log(e);
      emitter({ err: new Error('Upload failed') });
      emitter(END);
    };
    xhr.upload.addEventListener('progress', onProgress);
    xhr.upload.addEventListener('error', onFailure);
    xhr.upload.addEventListener('abort', onFailure);
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr;
      if (readyState === 4) {
        if (status === 200) {
          emitter({ success: true });
          emitter(END);
        } else {
          console.log(xhr.responseText);
          onFailure();
        }
      }
    };
    xhr.open('PUT', endpoint);
    // xhr.setRequestHeader("X-PINGOTHER", "pingpong");
    // xhr.setRequestHeader('X-Amz-ACL', 'public-read');
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
    return () => {
      xhr.upload.removeEventListener('progress', onProgress);
      xhr.upload.removeEventListener('error', onFailure);
      xhr.upload.removeEventListener('abort', onFailure);
      xhr.onreadystatechange = null;
      xhr.abort();
    };
  }, buffers.sliding(2));
}

// Upload the specified file
export function* uploadFileSaga(data: UploadRequestPayload) {
  const { file, endpoint, filename } = data;
  const channel = yield call(createUploadFileChannel, endpoint, file);
  while (true) {
    const { progress = 0, err, success } = yield take(channel);
    if (err) {
      yield put(uploadError({ filename, error: err.message }));
      return;
    }
    if (success) {
      yield put(uploadSuccess({ filename }));
      return;
    }
    yield put(uploadProgress({ filename, progress }));
  }
}

// Watch for an upload request and then
// defer to another saga to perform the actual upload
export function* watchUploadRequest() {
  yield takeEvery(UiActionTypes.UPLOAD_REQUEST, function* (
    action: ActionUploadRequest,
  ) {
    yield call(uploadFileSaga, action.payload);
  });
}

export function* uiSagas() {
  yield all([fork(watchUploadRequest)]);
}
