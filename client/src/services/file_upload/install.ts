type TrackUploadUrl = { url: string; fileId: string };

export interface FileUploadService {
  getPresignedTrackUploadUrl(data: {
    trackId: string;
    type: string;
  }): Promise<TrackUploadUrl>;
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
      credentials: "include",
    }).then((body) => body.json());
  }
}

export function installFileUpload() {
  return new FileUploadClient();
}
