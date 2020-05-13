type TrackUploadUrl = { url: string; fileId: string };
type TrackUrl = { url: string; fileId: string };

export interface FileUploadService {
  getPresignedTrackUploadUrl(data: {
    trackId: string;
    type: string;
  }): Promise<TrackUploadUrl>;
  getPresignedTrackUrl(data: {
    trackId: string;
    quality?: string;
  }): Promise<TrackUrl>;
}

class FileUploadClient implements FileUploadService {
  async getPresignedTrackUploadUrl(data: {
    trackId: string;
    type: string;
  }): Promise<TrackUploadUrl> {
    const params = new URLSearchParams({
      type: data.type,
    });
    return fetch(`/track/${data.trackId}/upload?${params}`, {
      credentials: 'include',
    }).then((body) => body.json());
  }

  async getPresignedTrackUrl(data: {
    trackId: string;
    quality?: string;
  }): Promise<TrackUploadUrl> {
    const params = data.quality
      ? new URLSearchParams({
          quality: data.quality,
        })
      : '';
    return fetch(`/track/${data.trackId}/get`, {
      credentials: 'include',
    }).then((body) => body.json());
  }
}

export function installFileUpload() {
  return new FileUploadClient();
}
